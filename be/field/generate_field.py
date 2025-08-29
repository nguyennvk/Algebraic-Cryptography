from flask import request, jsonify, Blueprint
from utils import get_irreducible_polynomial, polinomial_modulo, polinomial_multiplication, polinomial_addition
from itertools import product
from sympy import isprime

generate_field = Blueprint('generate_field', __name__)
@generate_field.route('/generate_field', methods=['GET'])
def get_generate_field():
    """
    Generate a finite field GF(p^d) using the polynomial representation.
    """
    #Sanitize input
    p = request.args.get('p', type=int)
    d = request.args.get('d', type=int)
    if p is None or d is None:
        return jsonify({"error": "Please provide both 'p' and 'd' parameters."}), 400
    if p <= 0 or d <= 0:
        return jsonify({"error": "Please provide positive integers for 'p' and 'd'."}), 400
    
    if isprime(p) == False:
        return jsonify({"error": "p must be a prime number."}), 400

    # Get irreducible polynomial
    poly = get_irreducible_polynomial(p, d)
    if poly is None:
        return jsonify({"error": "No irreducible polynomial found."}), 400
    
    result = {"elements": [], "irreducible_poly": {}}
    result["irreducible_poly"] = poly.to_json()
    def to_poly_json(l):
        """
        Convert a list of coefficients to a JSON representation.
        """
        return {len(l)-1-i: coeff for i, coeff in enumerate(l)}

    for x in product(range(p), repeat=d):
        result["elements"].append(to_poly_json(list(x)))
    add = [[] for _ in range(p**d)]
    prod = [[] for _ in range(p**d)]
    for i in range(p**d):
        for j in range(p**d):
            add[i].append(polinomial_addition(result["elements"][i], result["elements"][j], p, result["irreducible_poly"]))
            prod[i].append(polinomial_modulo(polinomial_multiplication(result["elements"][i], result["elements"][j], p), result["irreducible_poly"], p))
    for i in range(p**d):
        prod[0][i] = result["elements"][i]
        prod[i][0] = result["elements"][i]            
    result['add'] = add
    result['prod'] = prod

    return jsonify(result), 200
    
    