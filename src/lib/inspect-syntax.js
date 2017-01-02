export default function inspectSyntax(str) {
    try {
        new Function(str);
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new SyntaxError(e);
        }
    }
}