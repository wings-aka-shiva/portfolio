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
    title: "Intro to LLMs — How AI Actually Works",
    slug: "intro-to-llms",
    date: "May 2026",
    tags: ["LLM", "RAG", "AI Engineering", "Beginner", "Embeddings", "Plain English"],
    content: `
## The short version

Most of us use ChatGPT, Claude, or Gemini every day and treat them like magic boxes. You type something in, something useful comes out, and the middle part is fuzzy.

This is the explanation of the middle part. The version I wish someone had given me when I started. No equations. No jargon I won't explain. Just the intuition that finally made it click.

## What an AI like ChatGPT actually is

It is a giant pile of numbers.

That's it. That's the model. It's a file — somewhere between 100GB and a few terabytes — full of numbers called parameters. When you type a message, your text gets converted into numbers, those numbers get multiplied through the pile in a very specific way, and out the other end comes a list of probabilities for what word should come next. The system picks one of the likely words, adds it to the response, and runs the whole thing again to pick the next word. And the next. And the next.

That's what "the AI is generating a response" actually means. It's not thinking. It's not reasoning in any way you'd recognize. It's predicting the next word, over and over, faster than you can read.

The interesting question is: how does that pile of numbers know what word should come next?

## How the pile of numbers gets made

There are basically three stages.

### Stage 1 — Reading the entire internet (kind of)

A company like OpenAI or Anthropic takes an enormous amount of text — Wikipedia, books, forums, code from GitHub, news articles, scientific papers — and uses it to train a network. The network's only job during training is one task, repeated trillions of times:

Look at some text. Predict the next word.

It sees "The capital of France is" and tries to guess "Paris." If it guesses wrong, the training algorithm slightly adjusts every number in the pile so it's a tiny bit more likely to guess right next time. Repeat trillions of times across thousands of high-end computers running for weeks. Cost: tens of millions of dollars.

What you end up with is called a base model. It's brilliant — it's effectively absorbed an enormous chunk of recorded human knowledge — but it's also useless as a product.

If you ask a base model "How do I make a paper airplane?" it might respond with:

How do I make a kite?

How do I make a fort?

How do I make slime?

Why? Because on the internet, questions like that often appear in lists of similar questions. The base model isn't trying to help. It's just continuing the text in a way that would be statistically plausible on the open internet.

This is also where the famous "AI hallucination" problem comes from. The base model has effectively compressed a huge chunk of the internet down into a much smaller pile of numbers. Compression always loses information. Common, frequently-repeated facts compress well. Rare or specific facts get blurry. So when you ask a specific question, the model retrieves a blurry impression and fills in the blur with plausible-sounding details.

It's not lying. It genuinely cannot tell the difference between a fact it remembers clearly and one it's reconstructing from a blur. That's why grounding it in real documents (more on that below) matters so much.

### Stage 2 — Teaching it how to be helpful

The base model knows everything but acts like nothing. Stage 2 fixes that.

The company hires people — usually contractors — to write thousands of example conversations showing what a good, helpful response looks like. Things like:

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

This is the single most useful idea in the whole field, and almost everyone gets it wrong on first contact. Your friend says "I'll fine-tune ChatGPT to know about my company's private documents." Sounds reasonable. It isn't. Fine-tuning shapes behavior. It doesn't reliably plug in new knowledge. There's a different tool for that — which is the next section.

### Stage 3 — Polishing it (briefly)

There's a third stage where the model is shown multiple possible responses to the same question and a human picks which one is better. The model gradually learns to prefer the kind of responses humans prefer. It's how you go from "an okay assistant" to "actually pleasant to talk to."

You don't need to know more than that this stage exists. It's the polish.

## The big practical question: how do you make AI use your information?

Imagine you're a small company with 200 pages of internal handbooks, policies, and product docs. You want an AI that can answer your team's questions about that material. ChatGPT has never seen any of it. So how do you make this work?

You have three tempting options. Two are wrong.

**Wrong option 1:** Train your own AI from scratch. Costs tens of millions of dollars. Forget it.

**Wrong option 2:** Fine-tune ChatGPT on your documents. This sounds right but isn't — fine-tuning shapes behavior, not knowledge. You'd spend money, get a model that might know your docs in some hazy way, and it would still hallucinate around the edges. And every time you updated a document, you'd have to retrain.

**Right option:** Don't try to put the documents into the model. Instead, give them to the model at the moment of the question.

This trick is called RAG — Retrieval-Augmented Generation. And it's how almost every "AI that knows about your stuff" product works.

## How RAG actually works (the magic part)

Here's the wild bit. The thing that finally made me understand what's going on under the hood.

Computers can convert text into a position in space.

Not physical space — a strange, abstract, multi-dimensional space. Imagine a graph, but instead of having two axes (X and Y), it has hundreds of them. Every piece of text gets mapped to a single point in that space.

The trick is: texts that mean similar things end up near each other in that space, even if they don't share any words.

The phrase "annual leave entitlement" and the phrase "how many vacation days do I get?" share zero words in common. A normal keyword search would not match them. But in this strange multi-dimensional space, those two phrases end up sitting right next to each other, because the system that places them there has learned that they mean roughly the same thing.

That mapping — text to a position in space — is called an embedding. The space is sometimes called semantic space (semantic = meaning).

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

Here's the surprising part: the AI works by having every word in the context "look at" every other word to figure out what's relevant. If you double the size of the context, you don't double the work — you quadruple it. Every word now has to consider twice as many other words, and there are twice as many words doing the considering. Two times two is four.

This is why some questions cost pennies and others cost dollars. Long contexts are exponentially more expensive than short ones.

## Putting it all together

An AI like ChatGPT is a pile of numbers that's been trained to predict the next word, on a massive amount of internet text. That training gives it general knowledge but also a fuzzy memory, which is why it sometimes makes things up. A second training stage teaches it how to be helpful and well-behaved, but doesn't really add new facts. To get an AI to use information it was never trained on — like your company's private documents — you don't try to put the information inside the AI. You set up a system that finds the right material at the moment of the question and hands it to the AI to read on the spot. And the size of any single conversation has a hard limit, because the math of how the AI processes context makes long conversations exponentially more expensive than short ones.

Once you have those four ideas — base training, behavior tuning, retrieval, and the cost of context — most things you read about AI products start to make sense.`,
  },
];
