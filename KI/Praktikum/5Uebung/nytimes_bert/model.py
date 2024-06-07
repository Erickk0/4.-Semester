import numpy as np
import torch.nn as nn
import torch
from pytorch_lightning import LightningModule
from torch.optim import Adam
from transformers import AutoModel, PreTrainedModel, AutoTokenizer
import config as CONFIG


class NYTimesTokenizer:

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(
            CONFIG.MODEL_ID, add_prefix_space=True
        )

    def apply(self, words):
        # gets an input text (as a string), returns tokens.
        encoded = self.tokenizer(words, return_tensors="pt", padding=True)
        return encoded["input_ids"].squeeze()


class NYTimesBERT(LightningModule):
    """
    classifier which - given a news article - returns a news category.
    """

    def __init__(self, ncategories):
        super(NYTimesBERT, self).__init__()
        self.bert = AutoModel.from_pretrained(CONFIG.MODEL_ID)
        self.l1 = nn.Linear(self.bert.config.hidden_size, CONFIG.NCLASSES)
        self.loss_function = nn.CrossEntropyLoss()

    def forward(self, tokens, attn_mask):
        outputs = self.bert(input_ids=tokens, attention_mask=attn_mask)
        print(outputs.last_hidden_state.shape)
        embeddings = outputs.last_hidden_state[:, 0, :]
        scores = self.l1(embeddings)
        return scores

    def training_step(self, batch, batch_idx):
        # loads a batch of training data
        tokens, labels, attn_mask = batch["tokens"], batch["label"], batch["attn_mask"]
        # FIXME: inspect tokens and labels (especially their shape)
        # FIXME: run forward pass, obtaining a loss
        scores = self(tokens, attn_mask)
        loss = self.loss_function(scores, labels)
        self.log("training_loss", loss.item(), prog_bar=True, rank_zero_only=True)
        return loss

    def validation_step(self, batch, batch_idx):
        # loads a batch of validation data
        tokens, labels, attn_mask = batch["tokens"], batch["label"], batch["attn_mask"]
        scores = self(tokens, attn_mask)
        loss = self.loss_function(scores, labels)
        self.log("validation_loss", loss.item(), prog_bar=True, rank_zero_only=True)
        return loss

    def test_step(self, batch, batch_idx):
        """no need to touch."""
        raise NotImplementedError()

    def configure_optimizers(self):
        """no need to touch."""
        return Adam(self.parameters(), lr=CONFIG.LR)

    def load_state_dict(
        self, state_dict: "OrderedDict[str, Tensor]", strict: bool = True
    ):
        """used to load the model from disk. no need to touch."""
        return super(NYTimesBERT, self).load_state_dict(state_dict)