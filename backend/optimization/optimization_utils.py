from itertools import permutations
import numpy as np
from python_tsp.exact import solve_tsp_dynamic_programming
from python_tsp.distances import great_circle_distance_matrix

def get_tsp_result(point_list):
    point_list = np.array(point_list)
    distance_matrix = great_circle_distance_matrix(point_list)
    permutation, distance = solve_tsp_dynamic_programming(distance_matrix)
    return permutation, distance
