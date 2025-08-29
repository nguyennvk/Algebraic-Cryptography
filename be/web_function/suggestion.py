from typing import Dict, List

compound_functionalities = {
    "Basic Arithmetic": ['Bezout', 'Carmichael', 'Power Modulo', 'GCD', 'Multiplicative Inverse'],
    "Cryptography": ['Discrete Logarithm Problem', 'RSA', 'Rho RSA'],
    "Digital Signature": ['Elgamal Signature', 'Elliptic Curve Signature', 'RSA Signature'],
    "Elliptic Curve": ["Elliptip Curve's Determinant", 'Point Addition on Elliptic Curve', 'Point Multiplication on Elliptic Curve', 'Point Order on Elliptic Curve', 'All Points on Elliptic Curve'],
    "Field": ['Field Generation', 'Polynomial GCD', 'Polynomial Modulo'],
    "Primary Test": ['Fermat\'s Test', 'Euler\'s Test', 'Miller-Rabin Test'],
}
functionalities = {
    # "Basic Arithmetic": ["/basic_arithmetic/bezout", "/basic_arithmetic/carmichael", "/basic_arithmetic/power_modulo", "/basic_arithmetic/gcd", "/basic_arithmetic/mul_inverse"],
    "Bezout": ["/basic_arithmetic/bezout"],
    "Carmichael": ["/basic_arithmetic/carmichael"],
    "Power Modulo": ["/basic_arithmetic/power_modulo"],
    "GCD": ["/basic_arithmetic/gcd"],
    "Greatest Common Divisor": ["/basic_arithmetic/gcd"],
    "Multiplicative Inverse": ["/basic_arithmetic/mul_inverse"],
    # "Cryptography": ["/cryptography/dlp", "/cryptography/rsa", "/cryptography/rho_rsa"],
    "Discrete Logarithm Problem": ["/cryptography/dlp"],
    "DLP": ["/cryptography/dlp"],
    "RSA": ["/cryptography/rsa"],
    "Rho RSA": ["/cryptography/rho_rsa"],
    # "Digital Signature": ["/digital_signature/elgamal", "/digital_signature/elliptic", "/digital_signature/rsa"],
    # "Elgamal Signature": ["/digital_signature/elgamal"],
    # "Elliptic Curve Signature": ["/digital_signature/elliptic"],
    # "RSA Signature": ["/digital_signature/rsa"],
    # "Elliptic Curve": ["/elliptic_curve/det", "/elliptic_curve/add", "/elliptic_curve/mul", "/elliptic_curve/order", "/elliptic_curve/points"],
    "Elliptip Curve's Determinant": ["/elliptic_curve/det"],
    "Point Addition on Elliptic Curve": ["/elliptic_curve/add"],
    "Point Multiplication on Elliptic Curve": ["/elliptic_curve/mul"],
    "Point Order on Elliptic Curve": ["/elliptic_curve/order"],
    "All Points on Elliptic Curve": ["/elliptic_curve/points"],
    # "Field": ["/field/generate", "/field/poly_gcd", "/field/poly_mod"],
    "Field Generation": ["/field/generate"],
    "Polynomial GCD": ["/field/poly_gcd"],
    "Polynomial Modulo": ["/field/poly_mod"],
    # "Primary Test": ["/primary_test/fermat", "/primary_test/euler", "/primary_test/miller_rabin"],
    "Fermat's Test": ["/primary_test/fermat"],
    "Euler's Test": ["/primary_test/euler"],
    "Miller-Rabin Test": ["/primary_test/miller_rabin"],
}


def contains_word(word: str, string: str) -> bool:
    return word.lower() in string.lower()


def get_matching_keys(word: str, obj: Dict[str, List[str]]) -> Dict[str, List[str]]:
    matching_keys = {}
    for key, value in obj.items():
        if contains_word(word, key):
            matching_keys[key] = value
    return matching_keys


def suggestion(word: str) -> Dict[str, List[str]]:
    result = get_matching_keys(word, functionalities)
    # compound_result = get_matching_keys(word, compound_functionalities)
    # for key, value in compound_result.items():
    #     for i in range(len(value)):
    #         result[value[i]] = functionalities[value[i]]
    return result