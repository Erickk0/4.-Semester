import heapq

class Node:
    def __init__(self, board, empty_tile_pos, moves=0, parent=None):
        self.board = board
        self.empty_tile_pos = empty_tile_pos
        self.moves = moves
        self.parent = parent

    def __str__(self):
        return str(self.board)

    def get_neighbors(self):
        neighbors = []
        x, y = self.empty_tile_pos
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < 3 and 0 <= ny < 3:
                new_board = [row[:] for row in self.board]
                new_board[x][y], new_board[nx][ny] = new_board[nx][ny], new_board[x][y]
                neighbors.append(Node(new_board, (nx, ny), self.moves + 1, self))
        return neighbors

    def is_goal(self):
        return self.board == [[1, 2, 3], [8, 0, 4], [7, 6, 5]]

    def __lt__(self, other):
        return self.moves < other.moves

initial_board = [[2, 8, 3], [1, 6, 4], [7, 0, 5]]

class PuzzleStateAStar(Node):
    def __init__(self, board, empty_tile_pos, moves=0, heuristic_cost=0, parent=None):
        super().__init__(board, empty_tile_pos, moves, parent)
        self.heuristic_cost = heuristic_cost

    def __lt__(self, other):
        return (self.moves + self.heuristic_cost) < (other.moves + other.heuristic_cost)

def manhattan_distance(board):
    goal_positions = {
        1: (0, 0), 2: (0, 1), 3: (0, 2),
        8: (1, 0), 0: (1, 1), 4: (1, 2),
        7: (2, 0), 6: (2, 1), 5: (2, 2)
    }
    distance = 0
    for i in range(3):
        for j in range(3):
            tile = board[i][j]
            if tile != 0:
                goal_x, goal_y = goal_positions[tile]
                distance += abs(goal_x - i) + abs(goal_y - j)
    return distance

def print_solution(state):
    path = []
    while state:
        path.append(state)
        state = state.parent
    path.reverse()
    for step in path:
        print(f'Move {step.moves}:')
        for row in step.board:
            print(row)
        print()

def a_star_search(initial_state):
    priority_queue = []
    heapq.heappush(priority_queue, initial_state)
    visited = set()
    visited.add(str(initial_state))

    while priority_queue:
        current_state = heapq.heappop(priority_queue)
        if current_state.is_goal():
            print_solution(current_state)
            return current_state.moves

        for neighbor in current_state.get_neighbors():
            neighbor.heuristic_cost = manhattan_distance(neighbor.board)
            if str(neighbor) not in visited:
                visited.add(str(neighbor))
                heapq.heappush(priority_queue, neighbor)

    return -1  # No solution found

initial_state_a_star = PuzzleStateAStar(initial_board, (2, 1), heuristic_cost=manhattan_distance(initial_board))
moves = a_star_search(initial_state_a_star)
print(f'Solution found in {moves} moves')
