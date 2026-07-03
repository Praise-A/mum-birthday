// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "@/pages/Home.jsx";

vi.mock("react-router-dom", () => ({
  Link: ({ children, className, to }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
}));

describe("Home", () => {
  it("renders the main birthday story sections", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ submissions: [] }),
      }),
    );

    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /happy 50th birthday/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("link", { name: /write a tribute/i })[0],
    ).toHaveAttribute("href", "/tributes");

    await waitFor(() => {
      expect(
        screen.getByText(/the way she made home feel larger than its walls/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", {
        name: /from the cradle till the golden age/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/help make this milestone a blessing for children/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/a toast from friends/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/decade 5/i),
    ).toBeInTheDocument();
  });
});
