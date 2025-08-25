import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SignIn from "@/app/auth/signin/page";

describe("SignIn", () => {
    it("renders signin page", () => {
        render(<SignIn />);
    });
});
