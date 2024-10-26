const dnaSequence = ['T', 'A', 'C', 'G', 'A']; // Example DNA sequence
const rnaPairs = {
    T: 'A',
    A: 'U',
    C: 'G',
    G: 'C'
};

let dnaSequence = generateRandomSequence(5);
let mrnaSequence = [];
let score = 0;
let currentIndex = 0;

};

const dnaTemplateElement = document.getElementById('dna-template');
const mrnaSequenceElement = document.getElementById('mrna-sequence');
const stage1Feedback = document.getElementById('stage1-feedback');
const dropzone = document.getElementById('score-counter');
const resetGameButton = document.getElementById('resetGame');

function generateRandomSequence(length) {
    let sequence = [];
    for (let i = 0; i < length; i++) {
        const randomBase = dnaBases[Math.floor(Math.random() * dnaBases.length)];
        sequence.push(randomBase);
    }
    return sequence;
}

function initializeStage1() {
    dnaTemplateElement.innerHTML = ''; // Clear previous content
    mrnaSequenceElement.innerHTML = ''; // Clear previous content
    mrnaSequence = [];
    currentIndex = 0;
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

    updateExplanation("Welcome to the Base Pair Matching Game! Pair the mRNA bases with the DNA template. Remember, Adenine (A) pairs with Uracil (U) in RNA, and Cytosine (C) pairs with Guanine (G).");
}

document.querySelectorAll('.base').forEach(base => {
    base.addEventListener('dragstart', dragStart);
});

resetGameButton.addEventListener('click', initializeStage1);

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
        score++;
        scoreCounter.textContent = `Score: ${score}`;
        stage1Feedback.textContent = 'Correct! Bond formed.';
        stage1Feedback.style.color = '#28a745';

        if (score === dnaSequence.length) {
            stage1Feedback.textContent = 'All pairs matched! Great job!';
            updateExplanation("Great job! You've completed the matching game.");
        }
    } else {
        stage1Feedback.textContent = `Incorrect! ${droppedBase} cannot pair with ${correctBase}.`;
        stage1Feedback.style.color = '#dc3545';
    }
}

const capDropzone = document.getElementById('cap-dropzone');
const tailDropzone = document.getElementById('tail-dropzone');
const stage2Feedback = document.getElementById('stage2-feedback');
const capElement = document.getElementById('cap');
const tailElement = document.getElementById('tail');
const completeStage2Button = document.getElementById('completeStage2');
const removeIntronsButton = document.getElementById('removeIntrons');
const mrnaSequenceElement2 = document.getElementById('mrna-sequence-2');

const explanationElement = document.getElementById('explanation');

const mrnaCodonSequenceElement = document.getElementById('mrna-codon-sequence');
const polypeptideSequenceElement = document.getElementById('polypeptide-sequence');
const stage3Feedback = document.getElementById('stage3-feedback');
const completeStage3Button = document.getElementById('completeStage3');

let currentIndex = 0;
let mrnaSequence = [];
let polypeptideChain = [];
let isCapAdded = false;
let isTailAdded = false;
let intronIndexes = [2, 4]; // Example introns at index 2 and 4

document.querySelectorAll('.base').forEach(base => {
    base.addEventListener('dragstart', dragStart);
});

dropzone.addEventListener('dragover', dragOver);
dropzone.addEventListener('drop', drop);

capElement.addEventListener('dragstart', dragStart);
tailElement.addEventListener('dragstart', dragStart);

capDropzone.addEventListener('dragover', dragOver);
capDropzone.addEventListener('drop', dropCap);

tailDropzone.addEventListener('dragover', dragOver);
tailDropzone.addEventListener('drop', dropTail);

nextStage1Button.addEventListener('click', () => {
    document.getElementById('stage1').style.display = 'none';
    document.getElementById('stage2').style.display = 'block';
    setupStage2();
});

removeIntronsButton.addEventListener('click', removeIntrons);

completeStage2Button.addEventListener('click', () => {
    document.getElementById('stage2').style.display = 'none';
    document.getElementById('stage3').style.display = 'block';
    setupStage3();
});

function initializeStage1() {
    dnaSequence.forEach(base => {
        const dnaBaseElement = document.createElement('div');
        dnaBaseElement.classList.add('base');
        dnaBaseElement.textContent = base;
        dnaTemplateElement.appendChild(dnaBaseElement);
    });

    updateExplanation("Welcome to the DNA Transcription stage! In this stage, you'll pair mRNA bases with the DNA template. Remember, Adenine (A) pairs with Uracil (U) in RNA, and Cytosine (C) pairs with Guanine (G).");
    updateDropzone();
}

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.dataset.type || event.target.dataset.base || event.target.dataset.anticodon);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const droppedBase = event.dataTransfer.getData('text');
    const correctBase = rnaPairs[dnaSequence[currentIndex]];

    if (droppedBase === correctBase) {
        const mrnaBaseElement = document.createElement('div');
        mrnaBaseElement.classList.add('mrna-base');
        mrnaBaseElement.textContent = droppedBase;
        mrnaSequenceElement.insertBefore(mrnaBaseElement, dropzone);
        mrnaSequence.push(droppedBase);

        currentIndex++;
        stage1Feedback.textContent = 'Correct!';
        stage1Feedback.style.color = '#28a745';
        dropzone.classList.add('correct');
        setTimeout(() => {
            dropzone.classList.remove('correct');
        }, 500);

        if (currentIndex >= dnaSequence.length) {
            stage1Feedback.textContent = 'Stage 1 Complete!';
            nextStage1Button.style.display = 'block';
            dropzone.style.display = 'none'; // Hide dropzone after completion
            updateExplanation("Great job! You've completed the transcription process. Next, we'll process the mRNA by adding a 5' cap and poly-A tail, and remove the introns.");
        } else {
            updateDropzone(); // Keep dropzone active for the next base
        }
    } else {
        stage1Feedback.textContent = 'Incorrect! Try again.';
        stage1Feedback.style.color = '#dc3545';
        dropzone.classList.add('incorrect');
        setTimeout(() => {
            dropzone.classList.remove('incorrect');
        }, 500);
    }
}

function updateDropzone() {
    dropzone.textContent = ''; // Remove hint text, only show placeholder
}

function setupStage2() {
    mrnaSequenceElement2.innerHTML = ''; // Clear previous stage content
    mrnaSequence.forEach((base, index) => {
        const mrnaBaseElement = document.createElement('div');
        mrnaBaseElement.classList.add('mrna-base');
        mrnaBaseElement.textContent = base;
        mrnaBaseElement.dataset.index = index;
        mrnaSequenceElement2.appendChild(mrnaBaseElement);
    });

    capElement.style.display = 'block';
    updateExplanation("Now we'll process the mRNA. Start by dragging the 5' cap to the beginning of the sequence.");
}

function dropCap(event) {
    event.preventDefault();
    const droppedItem = event.dataTransfer.getData('text');

    if (droppedItem === 'cap' && !isCapAdded) {
        const capBaseElement = document.createElement('div');
        capBaseElement.classList.add('mrna-base');
        capBaseElement.textContent = 'Cap';
        mrnaSequenceElement2.insertBefore(capBaseElement, mrnaSequenceElement2.firstChild);
        stage2Feedback.textContent = '5’ Cap added!';
        stage2Feedback.style.color = '#28a745';
        capDropzone.classList.add('correct');
        setTimeout(() => {
            capDropzone.classList.remove('correct');
        }, 500);
        capElement.style.display = 'none';
        tailElement.style.display = 'block'; // Now show poly-A tail
        isCapAdded = true;
        updateExplanation("Great! Now drag the poly-A tail to the end of the sequence.");
    } else {
        stage2Feedback.textContent = 'Incorrect! You need to add the Cap first.';
        stage2Feedback.style.color = '#dc3545';
        capDropzone.classList.add('incorrect');
        setTimeout(() => {
            capDropzone.classList.remove('incorrect');
        }, 500);
    }
}

function dropTail(event) {
    event.preventDefault();
    const droppedItem = event.dataTransfer.getData('text');

    if (droppedItem === 'tail' && isCapAdded && !isTailAdded) {
        const tailBaseElement = document.createElement('div');
        tailBaseElement.classList.add('mrna-base');
        tailBaseElement.textContent = 'Tail';
        mrnaSequenceElement2.appendChild(tailBaseElement);
        stage2Feedback.textContent = 'Poly-A Tail added!';
        stage2Feedback.style.color = '#28a745';
        tailDropzone.classList.add('correct');
        setTimeout(() => {
            tailDropzone.classList.remove('correct');
        }, 500);
        tailElement.style.display = 'none';
        removeIntronsButton.style.display = 'block'; // Show the remove introns button
        isTailAdded = true;
        updateExplanation("Excellent! The next step is to remove the introns from the mRNA sequence. Click the button below to proceed.");
    } else {
        stage2Feedback.textContent = 'Incorrect! You need to add the Tail last.';
        stage2Feedback.style.color = '#dc3545';
        tailDropzone.classList.add('incorrect');
        setTimeout(() => {
            tailDropzone.classList.remove('incorrect');
        }, 500);
    }
}

function removeIntrons() {
    intronIndexes.forEach(index => {
        const intronElement = mrnaSequenceElement2.querySelector(`[data-index="${index}"]`);
        if (intronElement) {
            intronElement.remove();
        }
    });
    stage2Feedback.textContent = 'Introns removed!';
    stage2Feedback.style.color = '#28a745';
    removeIntronsButton.style.display = 'none';
    completeStage2Button.style.display = 'block'; // Show the complete button
    updateExplanation("Great job! You've completed mRNA processing. The mRNA is now ready to be translated into a protein.");
}

function setupStage3() {
    mrnaCodonSequenceElement.innerHTML = ''; // Clear previous content
    polypeptideSequenceElement.innerHTML = ''; // Clear previous content
    currentIndex = 0; // Reset index for codon matching

    codons.forEach((codon, index) => {
        const codonElement = document.createElement('div');
        codonElement.classList.add('mrna-base');
        codonElement.textContent = codon;
        codonElement.dataset.index = index;
        mrnaCodonSequenceElement.appendChild(codonElement);
    });

    updateExplanation("Now it's time for translation! Match the tRNA anticodons with the mRNA codons and form the correct polypeptide chain.");
}

document.querySelectorAll('[data-anticodon]').forEach(base => {
    base.addEventListener('dragstart', dragStart);
});

mrnaCodonSequenceElement.addEventListener('dragover', dragOver);
mrnaCodonSequenceElement.addEventListener('drop', function(event) {
    event.preventDefault();
    const droppedAnticodon = event.dataTransfer.getData('text');
    const currentCodon = codons[currentIndex];
    
    if (currentCodon === getCodonFromAnticodon(droppedAnticodon)) {
        const aminoAcid = tRNAs[droppedAnticodon];
        polypeptideChain.push(aminoAcid);

        const polypeptideElement = document.createElement('div');
        polypeptideElement.classList.add('mrna-base');
        polypeptideElement.textContent = aminoAcid;
        polypeptideSequenceElement.appendChild(polypeptideElement);

        currentIndex++;
        stage3Feedback.textContent = 'Correct!';
        stage3Feedback.style.color = '#28a745';

        if (currentIndex >= codons.length) {
            stage3Feedback.textContent = 'Translation Complete!';
            completeStage3Button.style.display = 'block';
            updateExplanation("Congratulations! You've successfully translated the mRNA sequence into a polypeptide chain.");
        }
    } else {
        stage3Feedback.textContent = 'Incorrect! Try again.';
        stage3Feedback.style.color = '#dc3545';
    }
});

function getCodonFromAnticodon(anticodon) {
    const codonMapping = {
        'UAC': 'AUG', // Methionine
        'CGA': 'GCU', // Alanine
        'GGC': 'CCG', // Proline
        'CCC': 'GGG'  // Glycine
    };
    return codonMapping[anticodon];
}

function updateExplanation(text) {
    explanationElement.textContent = text;
}

// Accordion functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        header.classList.toggle('active');
        const content = header.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
});

// Initialize the game
initializeStage1();
