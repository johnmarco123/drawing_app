import { hello_name } from "../Hello"

test("Should Pass", () => {
    let name = "John"
    expect(hello_name(name)).toBe(`Hello ${name}!`);
})

test("Should Fail", () => {
    let name = "Johnathin"
    expect(hello_name(name)).toBe(`Hello ${name}!`);
})