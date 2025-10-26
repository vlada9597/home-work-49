import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UserProfile from "./UserProfile";


global.fetch = vi.fn();

describe("UserProfile component", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test("показує помилку, якщо поле ID порожнє", async () => {
    render(<UserProfile />);
    fireEvent.click(screen.getByText(/search/i));
    expect(await screen.findByText(/please enter a user id/i)).toBeInTheDocument();
  });

  test("відображає індикатор Loading під час запиту", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "John Doe", email: "john@example.com", address: { city: "NY" } }),
    });

    render(<UserProfile />);
    fireEvent.change(screen.getByPlaceholderText(/enter user id/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByText(/search/i));

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => screen.getByText(/john doe/i));
  });

  test("відображає дані користувача після успішного запиту", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "Jane Doe",
        email: "jane@example.com",
        address: { city: "Paris" },
      }),
    });

    render(<UserProfile />);
    fireEvent.change(screen.getByPlaceholderText(/enter user id/i), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByText(/search/i));

    expect(await screen.findByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
  });

  test("відображає помилку, якщо користувача не знайдено", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<UserProfile />);
    fireEvent.change(screen.getByPlaceholderText(/enter user id/i), {
      target: { value: "999" },
    });
    fireEvent.click(screen.getByText(/search/i));

    expect(await screen.findByText(/user not found/i)).toBeInTheDocument();
  });
});