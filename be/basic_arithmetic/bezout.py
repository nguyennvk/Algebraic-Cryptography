from flask import request, jsonify, Blueprint
from math import gcd

bezout = Blueprint('bezout', __name__)

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
    calculation.pop(0)
    if len(calculation) == 0:
        calculation[gcd(a, b)] = {a: 1, b: 0} if a < b else {a: 0, b: 1}
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
    return {"raw": calculation, "refined": refine_result, "x": refine_result[gcd(a, b)][a], "y": refine_result[gcd(a, b)][b]}


@bezout.route('/bezout', methods=['GET'])
def get_bezout_sol():
    """
    Calculate the Bézout coefficients for two integers 'a' and 'b' such that ax+by=c using the Extended Euclidean algorithm.
    The function takes three integers 'a', 'b', and 'c' as query parameters and returns the Bézout coefficients along with the steps taken to compute them.
    If any of 'a', 'b', or 'c' is not provided, it returns an error message."""
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)
    c = request.args.get('c', type=int)
    if a is None or b is None or c is None:
        return jsonify({"error": "Please provide 'a', 'b', and 'c' as query parameters."}), 400
    if a == b:
        return jsonify({"error": "a and b must be unquie"}), 400
    if c % gcd(a, b) != 0:
        return jsonify({"error": "No solution exists for the given values of 'a', 'b', and 'c'."}), 400
    k = c // gcd(a, b)

    refine_result = bezout_coefficients(a, b)
    refine_result["k"] = k
    refine_result["gcd"] = gcd(a, b)

    return jsonify(refine_result), 200

