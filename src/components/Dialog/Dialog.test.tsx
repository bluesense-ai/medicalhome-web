import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import Dialog from ".";

describe("Dialog", () => {
  const mockProps = {
    header: "This is a Dialog Box",
    body: "This is the body of the Dialog Box",
    optionOne: <button>Button One</button>,
    optionTwo: <button>Button Two</button>,
  };

  it("Displays header and body of the modal correctly", () => {
    render(<Dialog {...mockProps} />);
    expect(screen.getByText(mockProps.header)).toBeInTheDocument();
    expect(screen.getByText(mockProps.body)).toBeInTheDocument();
  });

  it("Displays option one and options two correctly", () => {
    render(<Dialog {...mockProps} />);
    expect(screen.getByText("Button One")).toBeInTheDocument();
    expect(screen.getByText("Button Two")).toBeInTheDocument();
  });
});
