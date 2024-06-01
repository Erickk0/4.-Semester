from pytorch_lightning import Trainer
from torch.utils.data import Dataset, DataLoader
from pytorch_lightning.loggers import WandbLogger
from pytorch_lightning.callbacks import Callback
import config as CONFIG
from model import NYTimesBERT
import sys
import os
import torch
import json
from dataset import NYTimesDataset


def collate_fn_pad(batch):
    '''
    Padds batch of variable length
    '''
    lengths = [len(d['tokens']) for d in batch]
    maxlength = max(lengths)
    for d in batch:
        l = len(d['tokens'])
        d['attn_mask'] = [1] * len(d['tokens']) + [0] * (maxlength - l)
        d['tokens'] = list(d['tokens']) + [CONFIG.PAD_TOKEN_ID] * (maxlength - l)
    return {
        'attn_mask': torch.tensor([d['attn_mask'] for d in batch]),
        'tokens': torch.tensor([d['tokens'] for d in batch]),
        'label': torch.tensor([d['label'] for d in batch]).long()
    }


class MyCheckpointCallback(Callback):

    def __init__(self, path):
        self.epoch = 0
        self.path = path

    def on_train_epoch_end(self, trainer, pl_module):
        print("Training epoch done... calling callback.")
        if not os.path.isdir(self.path):
            os.mkdir(self.path)
        trainer.save_checkpoint(self.path + os.sep + '%s.cpt' % self.epoch, False)
        self.epoch += 1



def run_training(labeled_docs_train, labeled_docs_valid, epochs):
    dataset_train = NYTimesDataset(labeled_docs_train)
    dataset_valid = NYTimesDataset(labeled_docs_valid)
    dataloader_train = DataLoader(dataset=dataset_train,
                                  batch_size=CONFIG.BATCH_SIZE,
                                  shuffle=True,
                                  num_workers=CONFIG.NUM_WORKERS,
                                  persistent_workers=True,
                                  collate_fn=collate_fn_pad)
    dataloader_valid = DataLoader(dataset=dataset_valid,
                                  batch_size=CONFIG.BATCH_SIZE,
                                  shuffle=False,
                                  num_workers=CONFIG.NUM_WORKERS,
                                  persistent_workers=True,
                                  collate_fn=collate_fn_pad)
    model = NYTimesBERT(len(dataset_train.class2int))

    logger = WandbLogger(project='NYTimesBERT')
    my_checkpoint_callback = MyCheckpointCallback('checkpoints')

    trainer = Trainer(logger=logger,
                      log_every_n_steps=1,
                      min_epochs=epochs,
                      max_epochs=epochs,
                      gpus=1 if torch.cuda.is_available() else 0,
                      callbacks=[my_checkpoint_callback])
    trainer.validate(model, dataloaders=dataloader_valid)
    trainer.fit(model, dataloader_train, dataloader_valid)

    return model




if __name__ == '__main__':

    if len(sys.argv) < 3:
        print('USAGE: train.py <training_path> <valid_path>')
        exit(1)

    with open(sys.argv[1], 'r') as f:
        labeled_docs_train = json.load(f)['docs']
    with open(sys.argv[2], 'r') as f:
        labeled_docs_valid = json.load(f)['docs']

    model = run_training(labeled_docs_train, labeled_docs_valid, epochs=CONFIG.EPOCHS)
