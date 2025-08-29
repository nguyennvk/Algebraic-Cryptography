export default function beautifyExpression(expression) {
    const isDigitOnly = (str) => /^\d+$/.test(str);
    let result = "";
    const values = Object.values(expression);
    const keys = Object.keys(expression);
    for (let i = 0; i < values.length; i++) {
         if (values[i] != 0){
            if (values[i] == 1){
                result += "+" + keys[i];
            }
            else if (values[i] == -1){
                result += "-" + keys[i];
            }
            else if (values[i] > 0){
                if (isDigitOnly(keys[i])){
                    result += "+" + values[i]+"\\cdot"+keys[i];
                }
                else{
                    result += "+" + values[i] + keys[i];
                }
            }
            else if (values[i] < 0){
                if (isDigitOnly(keys[i])){
                    result += values[i]+"\\cdot"+keys[i];
                }
                else{
                    result += values[i] + keys[i];
                }
            }
         }
    }
    if (result[0] == "+"){
        result = result.substring(1);
    }
    return result;
}

