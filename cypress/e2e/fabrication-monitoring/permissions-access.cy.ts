/// <reference types="cypress" />

import { Permissions } from "@/app/i/fabrication-monitoring/[job]/_permissions/permissions";
import { UserRole } from "@/app/i/fabrication-monitoring/[job]/_permissions/types";

// Simulação de um mapeamento de role → login
const users = [
    {
        username: "claudio.gomes@harrispye.com",
        password: "1234",
        role: "MANAGER",
        fabricationPage: {
            addhp: true,
            edit: true,
            delete: true,
            view: true,
        },
    },
    {
        username: "thalles.almeida@harrispye.com",
        password: "1234",
        role: "OPERATOR",
        fabricationPage: {
            addhp: false,
            edit: true,
            delete: false,
            view: true,
        },
    },
    {
        username: "rodrigo.roli@harrispye.com",
        password: "1234",
        role: "CLIENT_APPROVER",
        fabricationPage: {
            addhp: false,
            edit: false,
            delete: false,
            view: true,
        },
    },
    {
        username: "jhonathan.silva@harrispye.com",
        password: "1234",
        role: "CLIENT_GUEST",
        fabricationPage: {
            addhp: false,
            edit: false,
            delete: false,
            view: true,
        },
    },
    {
        username: "mario.reis@harrispye.com",
        password: "1234",
        role: "OPERATION_MANAGER",
        fabricationPage: {
            addhp: false,
            edit: false,
            delete: false,
            view: true,
        },
    },
    // Outras roles comentadas
] as const;

describe("Verificar permissões por role no Fabrication Monitoring", () => {
    users.forEach((user) => {
        it(`Usuário ${user.username} - Role: ${user.role}`, () => {
            cy.intercept("POST", "/api/auth/callback/credentials").as(
                "loginRequest",
            );
            cy.intercept("GET", "/api/auth/session*").as("sessionRequest");

            // === Login ===
            cy.visit("/auth/signin");
            cy.get('input[name="email"]').type(user.username);
            cy.get('input[name="password"]').type(user.password);
            cy.get('button[type="submit"]').click();

            cy.wait("@loginRequest", { timeout: 10000 })
                .its("response.statusCode")
                .should("eq", 200);
            cy.wait("@sessionRequest", { timeout: 10000 });

            cy.visit("/i/fabrication-monitoring");
            // esperar actionHpMenu-skeleton desaparecer para pegar o actionHpMenu
            // e evitar que o teste falhe por conta de loading
            cy.get('[data-cy="actionHpMenu-skeleton"]', {
                timeout: 10000,
            }).should("not.exist");
            // === Verifica se o menu de ação está visível ===
            cy.get('[data-cy="actionHpMenu"]').should("be.visible").click();
            // === Permissões da Página (fabricationPage) ===
            cy.get('[data-cy="addHp"]').should(
                user.fabricationPage.addhp ? "be.enabled" : "be.disabled",
            );

            cy.contains("Summary").should(
                user.fabricationPage.view ? "be.visible" : "not.exist",
            );

            cy.contains("Edit").should(
                user.fabricationPage.edit ? "be.visible" : "not.exist",
            );

            cy.contains("Delete").should(
                user.fabricationPage.delete ? "be.visible" : "not.exist",
            );

            // === Segue apenas se tiver permissão de view ===
            if (user.fabricationPage.view) {
                cy.contains("Summary").click();
                cy.wait(10000);

                // === Graph ===
                const canViewGraph = Permissions.getFeaturePermission(
                    Permissions.FabMonFeaturesPermission.graph,
                    user.role,
                );
                cy.get('[data-cy="chartSpools"]', { timeout: 10000 }).should(
                    canViewGraph ? "exist" : "not.exist",
                );

                // === Summary ===
                const summaryPerm = Permissions.getFeaturePermission(
                    Permissions.FabMonFeaturesPermission.summary,
                    user.role,
                );

                if (
                    summaryPerm &&
                    typeof summaryPerm === "object" &&
                    summaryPerm.view
                ) {
                    cy.contains("Summary").should("exist");
                } else {
                    cy.contains("Summary").should("not.exist");
                }
                // === Botões da Tabela ===
                const canAddSpool = Permissions.getFeaturePermission(
                    Permissions.FabMonFeaturesPermission.addSpool,
                    user.role,
                );
                cy.get('[data-cy="addSpool"]').should(
                    canAddSpool ? "to.enabled" : "not.enabled",
                );

                const canEditSpool = Permissions.getFeaturePermission(
                    Permissions.FabMonFeaturesPermission.editSpool,
                    user.role,
                );

                cy.get('[data-cy="editTableToggle"]').should(
                    canEditSpool ? "to.enabled" : "not.enabled",
                );
                if (canEditSpool) cy.get('[data-cy="editTableToggle"]').click();

                const canDeleteSpool = Permissions.getFeaturePermission(
                    Permissions.FabMonFeaturesPermission.deleteSpool,
                    user.role,
                );
                cy.get('[data-cy="deleteSpoolRow"]').should(
                    canDeleteSpool ? "to.enabled" : "not.enabled",
                );
                const roleMap: Record<string, keyof UserRole> = {
                    APPROVER: "clientApprover",
                    GUEST: "clientGuest",
                    CLIENT_GUEST: "clientGuest",
                    OPERATION_MANAGER: "operationManager",
                    OPERATOR: "operator",
                    MANAGER: "manager",
                    DEFAULT: "default",
                };
                // === Colunas da Tabela de Spools ===

                const userRoleKey = roleMap[user.role] ?? "default";

                const spoolsPerms: UserRole[keyof UserRole] =
                    Permissions.FabMonSpoolsPermission[userRoleKey] ?? {};

                Object.entries(spoolsPerms).forEach(
                    ([columnKey, accessLevel]) => {
                        let selector = "";
                        if (accessLevel === "UPDATE") {
                            selector = `[data-cy="spool-column-${columnKey}"]`;
                            cy.get(selector).should("exist");
                        } else if (accessLevel === "READ") {
                            if (columnKey === "_actions") return;
                            selector = `[data-cy="spool-column-${columnKey}-readOnly"]`;

                            cy.get(selector).should("exist");
                        } else {
                            cy.get(selector).should("not.exist");
                        }
                    },
                );
            }
        });
    });
});
