from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.x(0)
qc.barrier()
qc.h([0,1])
qc.x(1)
qc.cx(1,0)
qc.x(1)
qc.barrier()
qc.h([0,1])
qc.measure_all()
print(qc.draw())