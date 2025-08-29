from flask import request, jsonify, Blueprint

elgamal_signature = Blueprint('elgamal_signature', __name__)
@elgamal_signature.route('/signature/elgamal_signature', methods=['GET'])
def get_elgamal_signature():
    """
    Verify whether Alice is authenticated by Bob using the Elgamel signature scheme.
    """
    # Sanitize input
    # Public key
    g = request.args.get('g', type=int)
    d = request.args.get('d', type=int)
    a = request.args.get('A', type=int)
    s1 = request.args.get('s1', type=int)
    s2 = request.args.get('s2', type=int)
    p = request.args.get('p', type=int)

    if g is None or d is None or a is None or s1 is None or s2 is None or p is None:
        return jsonify({"error": "Please provide 'g', 'd', 'A', 's1', 's2' and 'p' parameters."}), 400

    print(pow(a, s1, p))
    if pow(a, s1, p) * pow(s1, s2, p) % p == pow(g, d, p):
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 200