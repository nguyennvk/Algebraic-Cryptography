
export function parsePoly(expr: string){
    let coef;
    let expo;
    if (expr.length === 0) return [0, 0]
    else{
        const xIdx = expr.indexOf("x");
        if (xIdx == -1){
            return [parseInt(expr), 0]
        }
        coef = expr.slice(0, xIdx);
        if (xIdx === expr.length -1) expo = "1";
        else{
            expo = expr.slice(xIdx+2);
        }
        if (isNaN(parseInt(coef))) return [1, parseInt(expo)]
        else{
            return [parseInt(coef), parseInt(expo)];
        }
    }
}

export function extractPoly(expr: string){
    const obj: Record<string, number> = {};
    const allowCharacter = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
        "^", "x", "+", "-"];
    const terms = [];
    let term = ""
    // Isolate terms of polynomial
    for (let x=0;x<expr.length;x++)
    { 
        if (!allowCharacter.includes(expr.charAt(x))) return {}
        if ((expr.charAt(x) === "-" || expr.charAt(x) === "+"))
        {
            terms.push(term);
            term = expr.charAt(x);
        }
        else{
            term += expr.charAt(x);
        }
    }
    terms.push(term);
    let degree = 0
    // Construct an object from terms ofpolynomial
    for (const t of terms)
    {
        if (t !== ""){
        const extract_term = parsePoly(t);
        if (degree < extract_term[1]) degree = extract_term[1];
        if (!(extract_term[1] in obj)) {
            obj[extract_term[1]] = extract_term[0];
        }
        else{
            obj[extract_term[1]] += extract_term[0];
        }
    }
    }
    for (let x=0;x<=degree;x++)
    {
        if (!(x in obj)) obj[x] = 0;
    }
    return obj;
}

// {0: 1, 1: 0, 2: 5, 3: -12, 4: 1}
export function polyToLatex(obj: Record<number, number>){
    let latex = "";
    let add_term = "";
    for (const key of Object.keys(obj).sort().reverse()) {
        if (obj[key] !== 0){
            if (key == 0) add_term = `${obj[key]}`;
            else if (key == 1) {
                if (obj[key] == 1) add_term = 'x'
                else if (obj[key] == -1) add_term = '-x'
                else add_term = `${obj[key]}x`
            }
            else if (obj[key] == 1) add_term = `x^${key}`
            else {
                if (obj[key] == 1) add_term = `x^${key}`
                else if (obj[key] == -1) add_term = `-x^${key}`
                else add_term = `${obj[key]}x^${key}`
            }
            if (add_term.charAt(0) != "-"){
                add_term = "+"+add_term;
            }
            latex += add_term;
        }
    }
    if (latex.charAt(0) == "+") return latex.slice(1);
    if (latex == "") return "0"
    return latex
}
