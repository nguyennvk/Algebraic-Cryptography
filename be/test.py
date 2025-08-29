from math import gcd

def bezout_coefficients(a, b):
    calculation = {}
    
    def euclid(a, b):
        while b:
            calculation[a%b] = {a: 1, b: -(a//b)}
            a, b = b, a % b
        return {"gcd": a, "steps": calculation}
    a = abs(a)
    b = abs(b)
    raw_result = euclid(a, b) if a > b else euclid(b, a)
    refine_result = {}
    def multiply_dict_n(d, n):
        result = {}
        for x in d:
            result[x] = d[x] * n
        return result
    if len(calculation) > 1:
        calculation.pop(0)
    for x in calculation:
        refine_result[x] = {a: 0, b: 0}
        for y in calculation[x]:
            if y == a:
                refine_result[x][a] += calculation[x][y]
            elif y == b:
                refine_result[x][b] += calculation[x][y]
            else:
                sub_coefficient = multiply_dict_n(refine_result[y], calculation[x][y])
                refine_result[x][a] += sub_coefficient[a]
                refine_result[x][b] += sub_coefficient[b]
    return {"raw": calculation, "refined": refine_result,}

if __name__ == "__main__":
    a = 5
    b = 10
    result = bezout_coefficients(a, b)
    print(result)