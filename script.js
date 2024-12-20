const dnaBases = ['A', 'T', 'C', 'G'];
const rnaPairs = {
    T: 'A',
    A: 'U',
    C: 'G',
    G: 'C'
};

const codonToAminoAcid = {
    UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
    CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
    AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met',
    GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
    // Add more codons as needed
};

const knownSequences = [
    ['A', 'T', 'G', 'C', 'C'],
    ['T', 'A', 'C', 'G', 'A'],
    ['C', 'G', 'T', 'A', 'G'],
    ['G', 'C', 'A', 'T', 'C'],
    ['A', 'A', 'T', 'G', 'G']
];
let dnaSequence = knownSequences[Math.floor(Math.random() * knownSequences.length)];
let mrnaSequence = [];
let score = 0;

const dnaTemplateElement = document.getElementById('dna-template');
const mrnaSequenceElement = document.getElementById('mrna-sequence');
const stage1Feedback = document.getElementById('stage1-feedback');
const scoreCounter = document.getElementById('score-counter');
const resetGameButton = document.getElementById('resetGame');
const themeToggleButton = document.getElementById('themeToggle');
const gameTitle = document.getElementById('game-title');
const keySection = document.querySelector('.key-section');
const feedback = document.querySelector('.feedback');

function generateRandomSequence(length) {
    return knownSequences[Math.floor(Math.random() * knownSequences.length)];
}

function initializeStage1() {
    dnaTemplateElement.innerHTML = '';
    mrnaSequenceElement.innerHTML = '';
    mrnaSequence = [];
    score = 0;
    scoreCounter.textContent = `Score: ${score}`;
    dnaSequence = generateRandomSequence(5);

    dnaSequence.forEach(base => {
        const dnaBaseElement = document.createElement('div');
        dnaBaseElement.classList.add('dna-base');
        dnaBaseElement.textContent = base;
        dnaTemplateElement.appendChild(dnaBaseElement);

        const mrnaDropzone = document.createElement('div');
        mrnaDropzone.classList.add('dropzone');
        mrnaDropzone.dataset.correctBase = rnaPairs[base];
        mrnaDropzone.addEventListener('dragover', dragOver);
        mrnaDropzone.addEventListener('drop', drop);
        mrnaSequenceElement.appendChild(mrnaDropzone);
    });

    updateExplanation("Welcome to the Base Pair Matching Game! Pair the mRNA bases with the DNA template.");
}

document.querySelectorAll('.base').forEach(base => {
    base.addEventListener('dragstart', dragStart);
});

resetGameButton.addEventListener('click', initializeStage1);

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.game-container').classList.toggle('dark-mode');
    gameTitle.classList.toggle('dark-mode');
    keySection.classList.toggle('dark-mode');
    feedback.classList.toggle('dark-mode');
    document.querySelectorAll('.dna-base').forEach(base => {
        base.classList.toggle('dark-mode');
    });
    document.querySelectorAll('.base').forEach(base => {
        base.classList.toggle('dark-mode');
    });
    document.querySelectorAll('.dropzone').forEach(dropzone => {
        dropzone.classList.toggle('dark-mode');
    });
    resetGameButton.classList.toggle('dark-mode');
});

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.dataset.base);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const droppedBase = event.dataTransfer.getData('text');
    const correctBase = event.target.dataset.correctBase;

    if (droppedBase === correctBase) {
        event.target.textContent = droppedBase;
        event.target.classList.add('matched');
        mrnaSequence.push(droppedBase);
        score++;
        scoreCounter.textContent = `Score: ${score}`;
        stage1Feedback.textContent = 'Correct! Bond formed.';
        stage1Feedback.style.color = '#28a745';

        if (score === dnaSequence.length) {
            showProteinOptions();
        }
    } else {
        stage1Feedback.textContent = `Incorrect! ${droppedBase} cannot pair with ${correctBase}.`;
        stage1Feedback.style.color = '#dc3545';
    }
}

function showProteinOptions() {
    document.getElementById('stage1-container').style.display = 'none';
    const stage2Container = document.createElement('div');
    stage2Container.classList.add('stage2-container');
    document.body.appendChild(stage2Container);

    const header = document.createElement('h1');
    header.textContent = 'mRNA Sequence and Possible Proteins';
    stage2Container.appendChild(header);

    const mrnaDisplay = document.createElement('p');
    mrnaDisplay.textContent = `mRNA Sequence: ${mrnaSequence.join('')}`;
    stage2Container.appendChild(mrnaDisplay);

    const proteinOptionsHeader = document.createElement('h2');
    proteinOptionsHeader.textContent = 'Possible Proteins:';
    stage2Container.appendChild(proteinOptionsHeader);

    const proteinOptionsList = document.createElement('ul');
    const possibleProteins = getPossibleProteins(mrnaSequence.join(''));
    possibleProteins.forEach(protein => {
        const listItem = document.createElement('li');
        listItem.textContent = protein;
        proteinOptionsList.appendChild(listItem);
    });
    stage2Container.appendChild(proteinOptionsList);

    const info = document.createElement('p');
    info.textContent = 'These proteins are made up of the amino acids derived from the codon sequence of the mRNA. Each codon translates into a specific amino acid, forming a protein.';
    stage2Container.appendChild(info);
}

function getPossibleProteins(mrnaString) {
    let proteins = [];
    let proteinSequence = '';

    for (let i = 0; i < mrnaString.length; i += 3) {
        const codon = mrnaString.substring(i, i + 3);
        const aminoAcid = codonToAminoAcid[codon] || 'Unknown';
        proteinSequence += aminoAcid + ' ';
    }

    proteins.push(proteinSequence.trim());
    return proteins;
}

initializeStage1();
