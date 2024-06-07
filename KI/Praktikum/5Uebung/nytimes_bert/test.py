from model import NYTimesBERT
from dataset import NYTimesDataset
from train import run_training
from torch.utils.data import DataLoader
import sys
import json
import torch
import numpy as np
from train import collate_fn_pad
import config as CONFIG


def apply_model(model, labeled_docs_test):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()  # Set model to evaluation mode

    dataset_test = NYTimesDataset(labeled_docs_test)
    dataloader_test = DataLoader(
        dataset=dataset_test,
        batch_size=CONFIG.BATCH_SIZE,
        shuffle=False,
        num_workers=1,
        persistent_workers=True,
        collate_fn=collate_fn_pad,
    )
    int2class = {i: c for (c, i) in dataset_test.class2int.items()}

    correct = 0
    for i, batch in enumerate(dataloader_test):
        tokens, labels, attn_mask = batch["tokens"].to(device), batch["label"].to(device), batch["attn_mask"].to(device)

        # Truncate sequences longer than the maximum sequence length for the model
        max_length = model.bert.config.max_position_embeddings
        if tokens.size(1) > max_length:
            tokens = tokens[:, :max_length]
            attn_mask = attn_mask[:, :max_length]

        with torch.no_grad():  # Disable gradient calculation for inference
            scores = model.forward(tokens=tokens, attn_mask=attn_mask)

        np_scores = scores.detach().cpu().numpy()  # Move to CPU for numpy operations
        for x in range(len(labels)):
            highest_score_index = np.where(np_scores[x] == np.max(np_scores[x]))
            if highest_score_index[0] == labels[x].item():
                correct += 1
        nsamples = (i + 1) * CONFIG.BATCH_SIZE
        print(
            "Running (macro-averaged) Accuracy after %d samples: %.1f percent"
            % (nsamples, 100 * correct / nsamples)
        )


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("USAGE: print_sample.py <MODEL_CHECKPOINT> <test_path>")
        exit(1)

    with open(sys.argv[2], "r") as f:
        labeled_docs_test = json.load(f)["docs"]

    model = NYTimesBERT.load_from_checkpoint(sys.argv[1], ncategories=CONFIG.NCLASSES)

    apply_model(model, labeled_docs_test)