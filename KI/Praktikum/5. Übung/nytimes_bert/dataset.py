from torch.utils.data import Dataset
from model import NYTimesTokenizer
import sys
import json
import config as CONFIG




class NYTimesDataset(Dataset):

    def __init__(self, labeled_docs):
        super(NYTimesDataset, self).__init__()
        self.texts = [doc['title'] + '\n\n' + doc['intro'] + '\n\n' + doc['body']
                      for _id,doc in labeled_docs.items()]
        self.labels = [doc['label']
                      for _id,doc in labeled_docs.items()]
        self.class2int = {l:i for i,l in enumerate(sorted(set(self.labels)))}
        self.tokenizer = NYTimesTokenizer()

    def __getitem__(self, index):
        text = self.texts[index]
        tokens = self.tokenizer.apply(text)[:CONFIG.MAX_LENGTH]
        label = self.class2int[self.labels[index]]
        return {'tokens': tokens, 'label': label}

    def __len__(self):
        return len(self.texts)


if __name__ == '__main__':
    with open(sys.argv[1], 'r') as f:
        data = json.load(f)
        labeled_docs = data['docs']

    dataset = NYTimesDataset(labeled_docs)
    print("============================================")
    print( dataset[0] )
    print("============================================")
    print( dataset[1] )
