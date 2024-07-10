import copy
#breite Puzzle
n = 3

# mögliche Züge
rows = [1, 0, -1, 0]
cols = [0, -1, 0, 1]

class Node:
    def __init__(self, parent, board, empty_pos, cost, level):
        self.parent = parent  # vorgängerknoten
        self.board = board  # aktueller Zustand des Puzzels
        self.empty_pos = empty_pos # position leere Kachel
        self.cost = cost  # anzahl der falschen positionierten Kacheln
        self.level = level  # Tiefe des KNoten im Suchbaum

def calculate_cost(board, goal): # Kostenfunktion zählt wie viele kacheln an der falschen Position sind
    count = 0
    for i in range(n):
        for j in range(n):
            if board[i][j] and board[i][j] != goal[i][j]:  # wenn nicht leer und falsche Position dann count +1
                count += 1
    return count

def generate_node(board, empty_pos, new_empty_pos, level, parent, goal):
    new_board = copy.deepcopy(board)  # verwenden wir damit der aktuelle Zustand nicht verändert wird bzw nicht überschrieben wird und mit einer Kopie gearbeitet wird
    x1, y1 = empty_pos  # leere Kachel aktueller Zustand
    x2, y2 = new_empty_pos  # leere Kachel neuer Zustand
    new_board[x1][y1], new_board[x2][y2] = new_board[x2][y2], new_board[x1][y1]  # tauschen der Kacheln z.B. x,y = y,x
    cost = calculate_cost(new_board, goal)
    return Node(parent, new_board, new_empty_pos, cost, level)  # nach veränderung des leeren kachel neues Spielbrett zurückgeben

def is_valid(x, y):
    return 0 <= x < n and 0 <= y < n  # prüft ob wir noch in unserer matrix sind

def print_solution(node):
    path = []  # Liste für den Lösungsweg
    current = node  # ist der aktuelle knoten, von hier an verfolgen wir die Schritte zurück Ziel -> Start
    while current is not None:  # while bis wir den Startknoten erreicht haben
        path.append(current.board)  # aktuelles board dem path hinzufügen
        current = current.parent  # vorheriges board als current laden
    path.reverse()  # wir gehen vom Ziel zum Start deshalb muss die Reihenfolge umgedreht werden
    for i, board in enumerate(path):  # iterieren über die einzelnen boards
        print(f"Step {i}:")  # ausgabe Schritte
        print_board(board)  # darstellen des boards
        print()  # Leerzeile für lesbarkeit

def print_board(board):
    for row in board:  # durchläuft jede der drei zeilen
        print(" ".join(map(str, row)))  # umwandeln in String und dann aneinandereihen
    print()  # leerzeile für lesbarkeit

# Suchalgorithmen

def bfs(initial, empty_pos, goal):  # breitensuche
    queue = [Node(None, initial, empty_pos, calculate_cost(initial, goal), 0)] # Startknoten wird definiert, kein parent da erster knoten, initaial startboard, 0 = ebene der Breitensuche
    explored = set()  # set das bereits erkundete Boards spiechert
    steps = 0

    while queue:  # Warteschlange der Breitensuche
        node = queue.pop(0)  # knoten aus der Warteschlange nehmen (FIFO)
        steps += 1  # steps inkrementieren

        if node.board == goal:  # wenn zielboard erreicht
            print_solution(node)
            print(f"Schritte insgesamt: {steps}")
            return True

        explored.add(tuple(map(tuple, node.board)))  # fügt aktuelles Board ins set ein, wir erstellen zunächst ein Tupel der Zeilen und dann der gesamten Matrix

        for i in range(4):  # alle möglichen bewegungne der Leeren Kachel durchgehen
            new_x, new_y = node.empty_pos[0] + rows[i], node.empty_pos[1] + cols[i]
            if is_valid(new_x, new_y):  # prüft ob wir noch in den dimensionen der Puzzels sind n= 3
                child = generate_node(node.board, node.empty_pos, (new_x, new_y), node.level + 1, node, goal) # neuer kindknoten wegen neuer Position der leeren kachel
                if tuple(map(tuple, child.board)) not in explored:  # haben wir dieses board bereits erkunden ?
                    queue.append(child)  # wenn noch nicht erkundet dann in die Queue

    print("Keine Lösung möglich")
    return False

def dfs(initial, empty_pos, goal):
    stack = [(Node(None, initial, empty_pos, calculate_cost(initial, goal), 0), 0)]
    explored = set()  # explored set damit nicht mehrfach gesucht wird
    steps = 0

    while stack:  # solange stack nicht leer
        node, depth = stack.pop()  # nimmt obersten knoten vom stack
        steps += 1

        if node.board == goal:  # Wenn lösung dann print solution
            print_solution(node)
            print(f"Schritte insgesamt: {steps}")
            return True

        if depth < 50:   # Maximale Tiefe, sonst fehler
            explored.add(tuple(map(tuple, node.board)))
            for i in range(4):
                new_x, new_y = node.empty_pos[0] + rows[i], node.empty_pos[1] + cols[i]
                if is_valid(new_x, new_y):
                    child = generate_node(node.board, node.empty_pos, (new_x, new_y), node.level + 1, node, goal)
                    if tuple(map(tuple, child.board)) not in explored:
                        stack.append((child, depth + 1))  # fügt knoten zum stack hinzu falls noch nicht erkundet

    print("Keine Lösung möglich")
    return False

#  Start Board
initial_board = [
    [2, 8, 3],
    [1, 6, 4],
    [7, 0, 5]
]

#  Ziel Board
goal_board = [
    [1, 2, 3],
    [8, 0, 4],
    [7, 6, 5]
]

#  Position Leere Kachel
empty_pos = (2, 1)

#  Lösen des Puzzles mit BFS
print("Breitensuche:")
bfs(initial_board, empty_pos, goal_board)

#  Lösen des Puzzles mit DFS
print("Tiefensuche:")
dfs(initial_board, empty_pos, goal_board)
