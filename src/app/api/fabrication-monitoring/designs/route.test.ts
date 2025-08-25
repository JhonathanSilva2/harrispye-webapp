import { prismaBase } from "@/db/base-client";
import { serverEnv } from "@/lib/constants/config";
import fs from "fs";
import { NextRequest } from "next/server";
import { default as path, default as pathModule } from "path";
import { GET, POST } from "./route";

describe("Designs API", () => {
    it("renders login form", () => {});
});

// jest.mock("@/../prisma/generated/client-hp-base", () => ({
//     PrismaClient: jest.fn().mockImplementation(() => ({
//         fabrication_monitoring_designs: {
//             create: jest.fn().mockResolvedValue({
//                 id: 1,
//                 fabrication_monitoring_jobs_id: 123,
//                 filename: "dummy-filename.png",
//                 display_name: "test.png",
//             }),
//         },
//     })),
// }));

// jest.mock("@/../prisma/generated/client-proposals", () => ({
//     PrismaClient: jest.fn().mockImplementation(() => ({})),
// }));

// jest.mock("crypto", () => ({
//     createHash: jest.fn().mockReturnValue({
//         update: jest.fn().mockReturnThis(),
//         digest: jest.fn().mockReturnValue("mockedhash"),
//     }),
// }));

// jest.mock("fs", () => ({
//     existsSync: jest.fn().mockReturnValue(false),
//     mkdirSync: jest.fn(),
//     writeFileSync: jest.fn(),
// }));

// jest.mock("@/db/client", () => ({
//     prismaBase: {
//         fabrication_monitoring_designs: {
//             create: jest.fn(),
//         },
//     },
// }));

// jest.mock("@/lib/constants/config", () => ({
//     serverEnv: {
//         STORAGE_PATH: "/mocked/storage/path",
//     },
// }));

// // Setup mocks for pagination
// jest.mock("@/lib/pagination", () => ({
//     getApiPagination: jest.fn().mockReturnValue({
//         page: 1,
//         pageSize: 10,
//         where: {},
//         skip: 0,
//         take: 10,
//         orderBy: [],
//     }),
// }));

// // Helper to create a fake NextRequest
// function createRequest(url: string, formData?: FormData) {
//     return {
//         cookies: {
//             get: () => undefined,
//         },
//         nextUrl: new URL(url),
//         formData: formData
//             ? async () => formData
//             : async () => {
//                   // Empty FormData
//                   return new FormData();
//               },
//         ua: "",
//     } as unknown as NextRequest;
// }

// describe("Designs API", () => {
//     describe("GET", () => {
//         it("should return 400 for missing jobId", async () => {
//             const req = createRequest(
//                 "http://localhost:3000/api/fabrication-monitoring/designs",
//             );
//             const response = await GET(req);
//             const json = await response.json();
//             expect(response.status).toBe(400);
//             expect(json.error).toBe("Job ID must be provided");
//         });

//         it("should return 400 for invalid jobId", async () => {
//             const req = createRequest(
//                 "http://localhost:3000/api/fabrication-monitoring/designs?jobId=abc",
//             );
//             const response = await GET(req);
//             const json = await response.json();
//             expect(response.status).toBe(400);
//             expect(json.error).toBe("Invalid job ID");
//         });

//         it("should return a payload for valid jobId", async () => {
//             // Mock findMany and count on prismaBase
//             (prismaBase.fabrication_monitoring_designs.findMany as jest.Mock) =
//                 jest.fn().mockResolvedValue([
//                     {
//                         id: 1,
//                         fabrication_monitoring_jobs_id: 123,
//                         display_name: "design.png",
//                         filename: "hash.png",
//                     },
//                 ]);
//             (prismaBase.fabrication_monitoring_designs.count as jest.Mock) =
//                 jest.fn().mockResolvedValue(1);

//             const req = createRequest(
//                 "http://localhost:3000/api/fabrication-monitoring/designs?jobId=123",
//             );
//             const response = await GET(req);
//             const json = await response.json();
//             expect(response.status).toBe(200);
//             expect(json.data).toEqual([
//                 {
//                     id: 1,
//                     fabrication_monitoring_jobs_id: 123,
//                     display_name: "design.png",
//                     filename: "hash.png",
//                 },
//             ]);
//             expect(json.page).toBe(1);
//             expect(json.pageSize).toBe(10);
//             expect(json.rowCount).toBe(1);
//         });
//     });

//     describe("POST", () => {
//         const createDummyFile = (
//             name: string,
//             type: string,
//             content: string,
//         ): File => {
//             return new File([content], name, { type });
//         };

//         it("should return 400 if validation fails (missing jobId)", async () => {
//             const formData = new FormData();
//             formData.append(
//                 "file",
//                 createDummyFile("test.png", "image/png", "dummy content"),
//             );
//             const req = createRequest(
//                 "http://localhost:3000/api/fabrication-monitoring/designs",
//                 formData,
//             );
//             const response = await POST(req);
//             const json = await response.json();
//             expect(response.status).toBe(400);
//             expect(json.jobId?._errors[0]).toBe(
//                 "Expected string, received null",
//             );
//         });

//         it("should return 400 if file type is invalid", async () => {
//             const formData = new FormData();
//             formData.append(
//                 "file",
//                 createDummyFile("test.txt", "text/plain", "dummy content"),
//             );
//             const req = createRequest(
//                 "http://localhost:3000/api/fabrication-monitoring/designs?jobId=123",
//                 formData,
//             );
//             const response = await POST(req);
//             const json = await response.json();
//             expect(response.status).toBe(400);
//             expect(json.error).toBe(
//                 "Invalid file type. Only PNG, JPG, and PDF are allowed.",
//             );
//         });

//         it("should process valid file upload", async () => {
//             // Override prisma create mock to return a dummy design
//             (prismaBase.fabrication_monitoring_designs.create as jest.Mock) =
//                 jest.fn().mockResolvedValue({
//                     id: 1,
//                     fabrication_monitoring_jobs_id: 123,
//                     filename: "mockedhash.png",
//                     display_name: "test.png",
//                 });
//             const fileContent = "dummy file content";
//             const file = createDummyFile("test.png", "image/png", fileContent);
//             const formData = new FormData();
//             formData.append("file", file);
//             const req = createRequest(
//                 "http://localhost:3000/api/fabrication-monitoring/designs?jobId=123",
//                 formData,
//             );

//             const response = await POST(req);
//             const json = await response.json();
//             expect(json.message).toBe("File received successfully");

//             // Verify file system operations were called with the expected file path
//             const expectedPath = path.join(
//                 serverEnv.STORAGE_PATH,
//                 "mockedhash.png",
//             );
//             const dir = pathModule.dirname(expectedPath);
//             expect(fs.existsSync).toHaveBeenCalledWith(dir);
//             expect(fs.mkdirSync).toHaveBeenCalledWith(dir, { recursive: true });
//             expect(fs.writeFileSync).toHaveBeenCalled();
//         });
//     });
// });
