class MerkleTree {
  constructor(leaves, concat) {
    this.leaves = leaves;
    this.concat = concat;
  }

  getRoot() {
    if (this.leaves.length == 1) {
      return this.leaves[0];
    }

    const isOddTree = this.leaves.length % 2 != 0;
    let initialLength = this.leaves.length;
    let counter = 0;

    // * if there are more than two leaves in the array then remove two of them, concatenate them and add the result back to the array again.
    while (this.leaves.length > 1) {
      // * if it is the odd tree and counter reaches to the odd leaf, then just move that odd leaf again to the end of the array. And reset the initial length and counter again.
      if (isOddTree && counter == initialLength - 1) {
        const oddLeaf = this.leaves.shift();
        this.leaves.push(oddLeaf);

        initialLength = this.leaves.length;
        counter = 0;
      } else {
        const leaf1 = this.leaves.shift();
        const leaf2 = this.leaves.shift();
        this.leaves.push(this.concat(leaf1, leaf2));

        // * increase the counter by 2 because we are removing 2 leaves at the same time.
        counter += 2;
      }
    }

    // * after concatenating the only one value will be in the array and that will be root.
    return this.leaves[0];
  }

  getProof(index, layer = this.leaves, proof = []) {
    if (layer.length === 1) return proof;
    const newLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      let left = layer[i];
      let right = layer[i + 1];
      if (!right) {
        newLayer.push(left);
      } else {
        newLayer.push(this.concat(left, right));

        if (i === index || i === index - 1) {
          let isLeft = !(index % 2);
          proof.push({
            data: isLeft ? right : left,
            left: !isLeft,
          });
        }
      }
    }
    return this.getProof(Math.floor(index / 2), newLayer, proof);
  }
}

module.exports = MerkleTree;
