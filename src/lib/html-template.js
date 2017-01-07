// Source: http://www.2ality.com/2015/01/template-strings-html.html#comment-2078932192
import htmlEscape from "html-es6cape";

export default (literals, ...substs) => {
    return literals.raw.reduce((acc, lit, i) => {
        let subst = substs[i-1];
        if (Array.isArray(subst)) {
            subst = subst.join('');
        }
        if (acc.endsWith('@')) {
            subst = htmlEscape(subst);
            acc = acc.slice(0, -1);
        }
        return acc + subst + lit;
    });
};