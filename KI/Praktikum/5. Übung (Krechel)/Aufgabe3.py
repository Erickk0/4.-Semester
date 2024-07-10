# Example implementation for Breadth-First Search (BFS) on a graph

from collections import deque

def bfs(graph, start, goal):
    queue = deque([start])
    visited = set()
    visited.add(start)
    parent = {start: None}

    while queue:
        node = queue.popleft()
        if node == goal:
            break
        for neighbor in sorted(graph[node]):  # sort neighbors for consistent ordering
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = node
                queue.append(neighbor)

    path = []
    while node:
        path.append(node)
        node = parent[node]
    path.reverse()
    return path

graph = {
    'Start': ['2', '3'],
    '2': ['4', '5'],
    '3': ['6'],
    '4': [],
    '5': ['Ziel'],
    '6': [],
    'Ziel': []
}

path = bfs(graph, 'Start', 'Ziel')
print('BFS path:', path)

# Example implementation for Depth-First Search (DFS) on a graph

def dfs(graph, start, goal, order='asc'):
    stack = [start]
    visited = set()
    parent = {start: None}

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            if node == goal:
                break
            neighbors = sorted(graph[node], reverse=(order == 'desc'))
            for neighbor in neighbors:
                if neighbor not in visited:
                    parent[neighbor] = node
                    stack.append(neighbor)

    path = []
    while node:
        path.append(node)
        node = parent[node]
    path.reverse()
    return path

path_asc = dfs(graph, 'Start', 'Ziel', order='asc')
path_desc = dfs(graph, 'Start', 'Ziel', order='desc')
print('DFS path (ascending):', path_asc)
print('DFS path (descending):', path_desc)
