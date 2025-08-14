import AuthClient from "@/infra/auth-client";

type UpdateUserAttributesPayload = Partial<{
    department_id: number | null;
    localization_id: number | null;
    organization_id: number | null;
    role_id: number | null;
}>;

export async function updateUserAttributes(
    userId: number,
    attributes: UpdateUserAttributesPayload,
) {
    const url = new URL(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${userId}/user-attributes`,
    );

    const fetchOptions = {
        method: "POST",
        body: JSON.stringify(attributes),
        headers: { "Content-Type": "application/json" },
    };

    return await AuthClient(url.toString(), fetchOptions);
}
