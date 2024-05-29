import torch

torch.manual_seed(0)  # for reproducability

# print(torch.__version__)

x = torch.ones(10)
x = torch.randn(2,3)
x = torch.tensor([[1,2,3],[4,5,6]])
print(x.dtype, x.shape)                  # tensors have datatypes and shapes (like np arrays)
print(x)

x = torch.manual_seed(0)

print(x)

