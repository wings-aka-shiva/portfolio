export interface AIPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  content: string;
}

export const aiPosts: AIPost[] = [
  {
    id: "1",
    title: "Intro to LLMs - How AI Actually Works",
    slug: "intro-to-llms",
    date: "May 2026",
    tags: ["LLM", "RAG", "AI Engineering", "Beginner", "Embeddings", "Plain English"],
    content: `
## The short version

Most of us use ChatGPT, Claude, or Gemini every day and treat them like magic boxes. You type something in, something useful comes out, and the middle part is fuzzy.

This is the explanation of the middle part. The version I wish someone had given me when I started. No equations. No jargon I won't explain. Just the intuition that finally made it click.

## What an AI like ChatGPT actually is

It is a giant pile of numbers.

That's it. That's the model. It's a file - somewhere between 100GB and a few terabytes - full of numbers called parameters. When you type a message, your text gets converted into numbers, those numbers get multiplied through the pile in a very specific way, and out the other end comes a list of probabilities for what word should come next. The system picks one of the likely words, adds it to the response, and runs the whole thing again to pick the next word. And the next. And the next.

That's what "the AI is generating a response" actually means. It's not thinking. It's not reasoning in any way you'd recognize. It's predicting the next word, over and over, faster than you can read.

The interesting question is: how does that pile of numbers know what word should come next?

## How the pile of numbers gets made

There are basically three stages.

### Stage 1 - Reading the entire internet (kind of)

A company like OpenAI or Anthropic takes an enormous amount of text - Wikipedia, books, forums, code from GitHub, news articles, scientific papers - and uses it to train a network. The network's only job during training is one task, repeated trillions of times:

Look at some text. Predict the next word.

It sees "The capital of France is" and tries to guess "Paris." If it guesses wrong, the training algorithm slightly adjusts every number in the pile so it's a tiny bit more likely to guess right next time. Repeat trillions of times across thousands of high-end computers running for weeks. Cost: tens of millions of dollars.

What you end up with is called a base model. It's brilliant - it's effectively absorbed an enormous chunk of recorded human knowledge - but it's also useless as a product.

If you ask a base model "How do I make a paper airplane?" it might respond with:

How do I make a kite?

How do I make a fort?

How do I make slime?

Why? Because on the internet, questions like that often appear in lists of similar questions. The base model isn't trying to help. It's just continuing the text in a way that would be statistically plausible on the open internet.

This is also where the famous "AI hallucination" problem comes from. The base model has effectively compressed a huge chunk of the internet down into a much smaller pile of numbers. Compression always loses information. Common, frequently-repeated facts compress well. Rare or specific facts get blurry. So when you ask a specific question, the model retrieves a blurry impression and fills in the blur with plausible-sounding details.

It's not lying. It genuinely cannot tell the difference between a fact it remembers clearly and one it's reconstructing from a blur. That's why grounding it in real documents (more on that below) matters so much.

### Stage 2 - Teaching it how to be helpful

The base model knows everything but acts like nothing. Stage 2 fixes that.

The company hires people - usually contractors - to write thousands of example conversations showing what a good, helpful response looks like. Things like:

User: How do I sort an array in JavaScript?
Assistant: You can use the .sort() method. By default it sorts as text, so for numbers you'll want to pass a compare function:

\`\`\`javascript
numbers.sort((a, b) => a - b);
\`\`\`

A hundred thousand or so of these. Then the base model is trained further on these examples.

This stage is called fine-tuning. After fine-tuning, the model answers questions instead of continuing patterns. It declines harmful requests. It formats code properly. It asks clarifying questions when something is ambiguous.

The crucial thing to understand:

> Fine-tuning didn't teach it new facts. It taught it how to behave.

The model already knew everything from Stage 1. Stage 2 just taught it how to use what it knows, in a helpful conversational way.

This is the single most useful idea in the whole field, and almost everyone gets it wrong on first contact. Your friend says "I'll fine-tune ChatGPT to know about my company's private documents." Sounds reasonable. It isn't. Fine-tuning shapes behavior. It doesn't reliably plug in new knowledge. There's a different tool for that - which is the next section.

### Stage 3 - Polishing it (briefly)

There's a third stage where the model is shown multiple possible responses to the same question and a human picks which one is better. The model gradually learns to prefer the kind of responses humans prefer. It's how you go from "an okay assistant" to "actually pleasant to talk to."

You don't need to know more than that this stage exists. It's the polish.

## The big practical question: how do you make AI use your information?

Imagine you're a small company with 200 pages of internal handbooks, policies, and product docs. You want an AI that can answer your team's questions about that material. ChatGPT has never seen any of it. So how do you make this work?

You have three tempting options. Two are wrong.

**Wrong option 1:** Train your own AI from scratch. Costs tens of millions of dollars. Forget it.

**Wrong option 2:** Fine-tune ChatGPT on your documents. This sounds right but isn't - fine-tuning shapes behavior, not knowledge. You'd spend money, get a model that might know your docs in some hazy way, and it would still hallucinate around the edges. And every time you updated a document, you'd have to retrain.

**Right option:** Don't try to put the documents into the model. Instead, give them to the model at the moment of the question.

This trick is called RAG - Retrieval-Augmented Generation. And it's how almost every "AI that knows about your stuff" product works.

## How RAG actually works (the magic part)

Here's the wild bit. The thing that finally made me understand what's going on under the hood.

Computers can convert text into a position in space.

Not physical space - a strange, abstract, multi-dimensional space. Imagine a graph, but instead of having two axes (X and Y), it has hundreds of them. Every piece of text gets mapped to a single point in that space.

The trick is: texts that mean similar things end up near each other in that space, even if they don't share any words.

The phrase "annual leave entitlement" and the phrase "how many vacation days do I get?" share zero words in common. A normal keyword search would not match them. But in this strange multi-dimensional space, those two phrases end up sitting right next to each other, because the system that places them there has learned that they mean roughly the same thing.

That mapping - text to a position in space - is called an embedding. The space is sometimes called semantic space (semantic = meaning).

So a RAG system does this:

1. Take your 200 pages of company docs. Chop them into small chunks (a paragraph or so each).
2. Convert each chunk into a position in semantic space. Save those positions in a special database.
3. When a user asks a question, convert their question into a position in the same space.
4. Find the chunks that sit closest to the question.
5. Hand those chunks to the AI along with the original question, basically saying: "Here's the question. Here's some relevant material. Answer based on this."

The AI doesn't learn your documents. It reads them, fresh, every single time.

## Why questions have a size limit

When you have a conversation with an AI, everything in that conversation sits in something called the context window. Think of it as the AI's working memory for that one conversation. When the conversation ends, the working memory is wiped.

The context window has a hard limit, usually somewhere between a few thousand words and a few hundred thousand words depending on the model.

Here's the surprising part: the AI works by having every word in the context "look at" every other word to figure out what's relevant. If you double the size of the context, you don't double the work - you quadruple it. Every word now has to consider twice as many other words, and there are twice as many words doing the considering. Two times two is four.

This is why some questions cost pennies and others cost dollars. Long contexts are exponentially more expensive than short ones.

## Putting it all together

An AI like ChatGPT is a pile of numbers that's been trained to predict the next word, on a massive amount of internet text. That training gives it general knowledge but also a fuzzy memory, which is why it sometimes makes things up. A second training stage teaches it how to be helpful and well-behaved, but doesn't really add new facts. To get an AI to use information it was never trained on - like your company's private documents - you don't try to put the information inside the AI. You set up a system that finds the right material at the moment of the question and hands it to the AI to read on the spot. And the size of any single conversation has a hard limit, because the math of how the AI processes context makes long conversations exponentially more expensive than short ones.

Once you have those four ideas - base training, behavior tuning, retrieval, and the cost of context - most things you read about AI products start to make sense.`,
  },
  {
    id: "2",
    title: "What's Actually Inside ChatGPT?",
    slug: "whats-inside-chatgpt",
    date: "May 2026",
    tags: ["LLM", "Neural Networks", "Deep Learning", "Plain English", "AI Engineering"],
    content: `
## The short version

Last time I wrote about what AI knows - pretraining, fine-tuning, and RAG. This time I want to go one level deeper: what is an AI, structurally? What's actually inside the box when you send a message to ChatGPT or Claude?

Short answer: a giant pile of numbers, multiplied together in a specific way, billions of times per second.

That sounds like a non-answer. Let me unpack what it actually means, and why it matters once you start building with AI yourself.

## The pile of numbers

An AI like ChatGPT is, at its core, a file. Somewhere between 100GB and a few terabytes depending on the model. If you opened it, you'd find a long list of numbers - typically billions of them - called parameters (or weights).

That's the AI. No hidden code. No special "intelligence module." Just the numbers, plus a small program that knows how to multiply them in the right order.

When you send a message, this is roughly what happens:

1. Your text gets converted into numbers (one number per word-piece, roughly)
2. Those numbers get multiplied through the pile in a specific pattern
3. The output is another set of numbers, interpreted as probabilities for the next word
4. The system picks one of the likely words and appends it to the response
5. Repeat for the next word, and the next, and the next

That's the whole show. Multiply, add, squash, repeat - faster than you can read.

## What a neural network actually is

A "neural network" is just a structured way to organize the pile of numbers, and the rules for how they get multiplied.

Picture three vertical columns of dots:

\`\`\`
Input layer     Hidden layer     Output layer
    ●               ●                ●
    ●               ●                ●
    ●               ●                ●
    ●               ●                ●
\`\`\`

Each dot is a neuron - really just a slot that holds a number between 0 and 1. Every neuron in one layer is connected to every neuron in the next layer. Each connection has a weight: a single number that says "how strongly does this left-neuron influence this right-neuron?"

For one neuron in the hidden layer, the calculation is:

\`\`\`typescript
function computeNeuron(
  inputs: number[],     // activations from the previous layer
  weights: number[],    // one weight per incoming connection
  bias: number          // a constant offset for this neuron
): number {
  const weightedSum = inputs.reduce(
    (sum, input, i) => sum + input * weights[i],
    0
  );
  return sigmoid(weightedSum + bias);  // squash to (0, 1)
}
\`\`\`

That's it. Multiply each input by its weight, add them up, add a bias, squash the result. Repeat for every neuron in every layer. The output layer's highest-scoring neuron is the network's answer.

Two practical notes worth flagging:

The bias shifts a neuron's "default" output. A high bias makes the neuron eager to fire; a low one makes it skeptical, requiring strong incoming signals.

The squash function (sigmoid here, more commonly ReLU in modern networks) keeps values in a useful range and introduces non-linearity - without it, the entire stack of layers would collapse mathematically into a single linear function, and the network couldn't learn anything interesting.

## Where the "intelligence" lives

Pull any single weight out of a trained network and inspect it. Maybe it's 0.34. Maybe it's -1.7. What does it mean on its own?

Nothing.

The intelligence isn't in any single weight. It's in the pattern of all of them together - billions of tiny "votes" that, combined, somehow encode how to recognize a cat, write code, or summarize a legal document. There's no specific piece of the network you can point to and say "this is where it knows about cats." The knowledge is distributed across every weight, smeared throughout the structure.

This has real consequences for how you work with these models. You can't surgically edit what a model knows. You can't delete a specific fact. The "knowing" is too entangled. That's why companies use RAG to handle private data rather than trying to bake it into the weights.

## How the weights get set

So where do the billions of numbers come from? Nobody types them in.

The network learns them. Roughly:

1. Start with all weights set to random numbers. The network is useless - it gives nonsense.
2. Show it a training example with a known correct answer.
3. Compare its output to the correct answer. Compute how wrong it was - a number called loss.
4. For each weight, work out (with calculus) whether nudging it slightly up or slightly down would reduce the loss. Nudge accordingly.
5. Repeat with the next example. And the next. Millions or billions of times.

This process is training, and the math behind step 4 is called gradient descent - literally "walking gradually downhill toward lower loss." Each individual nudge is tiny. The pattern emerges only across billions of nudges, on billions of examples.

The cost matters here. Training a frontier model like GPT-4 or Claude reportedly costs tens of millions of dollars in compute alone. That's why nobody trains from scratch - you build on top of someone else's pretrained model.

## The wild part: we design the shape, not the content

When building a neural network, the engineers choose:

- How many layers
- How many neurons per layer
- What activation function to use (sigmoid, ReLU, etc.)
- What kind of architecture (a feedforward MLP, a CNN for images, a transformer for language)

They do not choose:

- What any neuron represents
- What pattern any weight encodes
- What features the middle layers will pay attention to

We provide the structure. Training fills in the meaning.

## The part we still can't fully explain

The middle layers - where most of the actual reasoning happens - are a black box.

We can see the inputs. We can see the outputs. We can read every single weight, every neuron's activation, every multiplication. We still can't fully explain how the network gets from one to the other.

This isn't laziness. It's one of the biggest open problems in the field, and an entire research area - interpretability - exists to chip away at it. Companies like Anthropic and DeepMind have teams whose job is to look inside trained networks and figure out what they've actually learned.

This matters for engineers because it affects how you build:

- You can't ship an AI system without testing it heavily, because you can't verify it from the inside.
- You can't fully trust a model on novel inputs, because you don't know how it generalizes.
- "Why did the model output X?" is often a question with no clean answer.

Production AI engineering is, in large part, designing around this opacity - evaluation harnesses, guardrails, monitoring, fallback paths.

## Why this matters when you're building with AI

**Model size has real tradeoffs.** Bigger models have more weights, which means more capacity to encode patterns - but also more cost per query, more latency, and more environmental impact. Choosing the smallest model that handles your task is a real engineering skill.

**You can't reliably "teach" a model new facts.** The weights are too entangled. Knowledge that wasn't in pretraining should be supplied at query time through RAG, not stuffed in via fine-tuning.

**Evaluation matters more than intuition.** Because the inside of the model is opaque, the only honest way to know if a change works is to test it on a held-out set of examples. Building eval harnesses is a non-glamorous skill that separates production AI engineers from people who ship demos.

**The hardware story matters more than people realize.** Neural networks took off in the early 2010s mainly because GPUs - originally designed for video games - turned out to be excellent at the kind of bulk number-multiplication that training requires. It's also why GPU access is a real bottleneck for AI startups today.
  `
  },
  {
  id: "3",
  title: "How AI actually learns: the algorithm behind every neural network",
  slug: "how-ai-actually-learns",
  date: "June 2026",
  tags: ["LLM", "neural networks", "gradient descent", "deep learning", "plain English", "AI engineering"],
  content: `
## The short version

In the previous post I wrote about what's inside an AI - billions of numbers called weights, organized into a neural network, multiplied through in a specific pattern to produce output. But I deliberately skipped a question: where do those billions of numbers actually come from?

Nobody types them in. The network learns them. That process is called training, and the algorithm at the heart of it is called gradient descent. It's surprisingly simple. It's also the single most important idea in modern AI - every model you've ever used was trained with some variant of it.

This post is what gradient descent actually is, why it works, and what its limitations mean for anyone building with AI.

## The setup: a network that doesn't know anything yet

Imagine you've just built a brand-new neural network - say, one that's supposed to recognize handwritten digits. The structure is in place: input layer (one neuron per pixel), some hidden layers, output layer (one neuron per digit 0–9).

But every weight in the network is set to a random number. Some are 0.3, some are -1.7, some are 0.05. They're noise.

You feed it an image of a 7. The output is garbage - maybe the "3" neuron lights up at 0.4 and every other neuron is somewhere between 0 and 0.6. The network has no idea what it's looking at, because no weight has any meaningful value yet.

Question: how do we go from "all weights random" to "weights tuned to recognize digits correctly"?

## Step 1: Measure how wrong the network is

For a given input, the network produces 10 output numbers (one per digit). For the image of a 7, the correct output would be: the "7" neuron at 1.0, every other neuron at 0.0.

Compare what we got to what we wanted. For each output neuron, take the difference (actual minus desired) and square it. Add up all 10 squared differences. That single number is called the cost (or loss).

\`\`\`typescript
function cost(actual: number[], desired: number[]): number {
  return actual.reduce((total, value, i) => {
    const diff = value - desired[i];
    return total + diff * diff;
  }, 0);
}
\`\`\`

Why squared? Two reasons. First, it keeps every difference positive - small negative errors don't cancel out small positive ones. Second, it penalizes large errors much more than small ones - an error of 1.0 contributes 1.0 to the cost, but an error of 2.0 contributes 4.0. The model is encouraged to fix big mistakes first.

Cost is a single number per training example. High cost = very wrong. Low cost = close to right. Training is the search for weight values that drive cost down.

## Step 2: Figure out which way to nudge each weight

Here's the conceptual leap.

Cost isn't a fixed number. It's a function - it depends on every single weight in the network. Change one weight by a tiny amount, and cost changes by a tiny amount.

So for every weight in the network - all 13,000, or 13 billion, however many - we can ask one question:

> "If I increase this weight slightly, does cost go up or down? And by how much?"

The answer to that question, for a single weight, is called the gradient for that weight. It's a number. A signed slope.

- **Positive gradient** → increasing the weight increases the cost → to reduce cost, decrease the weight.
- **Negative gradient** → increasing the weight decreases the cost → to reduce cost, increase the weight.
- **Large magnitude** → this weight has a big effect on cost right now → nudge it more aggressively.
- **Small magnitude** → this weight barely affects cost right now → nudge it gently.
- **Zero** → this weight is at a flat spot in the cost landscape → don't touch it.

In plain English: for every weight, move it in the opposite direction of its gradient, by an amount proportional to the magnitude of the gradient.

## Step 3: Apply the nudges, then repeat

Compute the gradient for every weight. Apply the nudge to every weight. The network is now very slightly less wrong than before.

Move to the next training example. Compute new gradients. Apply new nudges. Repeat with the next example. And the next. Millions of times, sometimes billions.

The clever algorithm that efficiently computes all these gradients in one sweep through the network is called backpropagation. You don't need to understand its math to work with neural networks. You just need to know it exists, and that it's what makes step 2 computationally tractable.

## The geometric picture: rolling downhill in a high-dimensional landscape

Here's the picture that makes gradient descent click.

Imagine the cost as a landscape - hills and valleys spread across an enormous map. Every possible setting of the network's weights corresponds to one point on the map. The altitude at that point is the cost.

High altitude = bad weight settings. Low altitude = good weight settings.

Training starts at a random point - somewhere on a hillside, since the initial weights are random. The gradient at that point is, geometrically, the steepest uphill direction. Move in the opposite direction. Repeat. You're rolling downhill, step by step, toward lower cost.

Eventually you settle into a valley. The gradients become small. The network has converged.

The catch - and it's a real one - is that the landscape has many valleys. Gradient descent finds a valley. Not necessarily the deepest one. That's called finding a local minimum rather than the global minimum. For decades this worried researchers. In practice, with networks that have millions or billions of weights, most local minima have roughly similar cost, so the network ends up "good enough" almost regardless of where it starts. This is one of the more pleasantly surprising empirical findings in deep learning.

## The learning rate: how big are the steps?

When we nudge a weight based on its gradient, we don't apply the full gradient as the step size. We multiply it by a small number first - typically something like 0.01. This multiplier is called the learning rate.

- **Too low?** Training crawls. Each step barely moves the weights, and it takes forever to reach a useful minimum.
- **Too high?** The network overshoots. Picture rolling a ball down a hill: a gentle push and it settles into the valley. A rocket-powered push and it flies over the valley, lands on the next hill, gets shoved again, and oscillates wildly without ever settling.

In practice, modern training uses adaptive learning rates - algorithms like Adam that automatically adjust the rate during training, large early when far from a minimum, small later as the network converges. But the fundamental trade-off remains: too small and you waste compute; too large and the network never settles.

## The overfitting trap

Here's the most counterintuitive thing about training neural networks: more training isn't always better.

Train a network on 100 images of handwritten digits. After enough rounds, the network achieves near-perfect performance on those 100 images. Cost is almost zero. Surely we're done?

Then we test it on 100 images it has never seen. Performance is terrible.

What happened is overfitting. Instead of learning the general patterns that distinguish digits, the network memorized the specific quirks of the 100 training images. It got perfect at those examples and learned nothing useful about digits in general.

> Overfitting is like a student who memorizes the textbook answers without understanding the concepts. They ace the textbook test. They fail any new test.

### Common causes

- **Not enough training data.** With too few examples, the network can only memorize, not generalize.
- **Too much training.** Even with good data, training beyond a certain point starts to fit the noise.
- **Too much model capacity.** A network with vastly more weights than the task requires has the room to memorize when it should be generalizing.

### Common fixes

- **More data.** Diverse examples force the network toward general patterns.
- **Early stopping.** Track performance on a separate validation set during training. Stop when validation performance peaks, even if training performance keeps improving.
- **Regularization.** Mathematical penalties that discourage the network from getting too "specific."
- **Simpler architectures.** Fewer weights, less capacity to memorize.

Recognising overfitting in production is one of the most important skills in applied AI engineering. If your model performs great in development and fails in the real world, this is almost always why.

## Why this matters when you're building with AI

You're unlikely to train neural networks from scratch in most AI engineering roles - that's done by labs with the budgets for it. But understanding what training is reshapes how you think about everything downstream.

**Fine-tuning is just continued training.** When you fine-tune a model on your own data, you're doing exactly the gradient descent process described here - starting from the pretrained weights rather than random ones, and nudging them based on your examples. This is why fine-tuning can shift behavior, but also why it can overfit if you're not careful.

**Evaluation isn't optional.** Because overfitting is real and silent, the only honest way to know if a model works is to test it on data it has never seen. This is why production AI engineering involves building eval harnesses, not just chatting with the model and judging vibes.

**Hyperparameters matter.** Learning rate, training duration, regularization strength - these aren't magic knobs that ML engineers fiddle with for fun. They're the levers that control whether your model learns the right thing or memorizes the wrong thing.

**The opacity is fundamental.** Training adjusts billions of weights, all coordinated through gradients. The result is a network where the meaning is smeared across the structure. You can't inspect the model and say "this is where it learned about cats." You can only test it on new examples and see what comes out. This is why interpretability is a real research field, and why production AI systems need guardrails and monitoring.

## What's next

Next up I'll write about attention - the trick that lets language models stay coherent across long conversations, and the architectural choice that made modern LLMs possible. Everything we've covered so far (neurons, weights, training, gradient descent) is the foundation; attention is what's built on top.

If something in this post didn't click, message me. I'd rather know what's still murky than write the next post in the dark.
`
}
];
