import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Log the incoming request data
    const { reminder, reminderDate, email } = await req.json();
    console.log('Received request data:', { reminder, reminderDate, email });

    // Ensure email and reminder are present
    if (!email || !reminder || !reminderDate) {
      console.error('Missing required fields in request:', { email, reminder, reminderDate });
      return NextResponse.json(
        { error: 'Missing required fields: email, reminder, or reminderDate.' },
        { status: 400 }
      );
    }

    // Setup the transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Log transporter details (sensitive data redacted)
    console.log('Email transporter configured:', {
      user: process.env.EMAIL_USER,
      service: 'gmail',
    });

    // Create email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${reminder}`,
      text: `You requested a reminder for: ${reminder}\nDate & Time: ${new Date(reminderDate).toLocaleString()}`,
    };

    // Log the email options being sent
    console.log('Sending email with the following options:', mailOptions);

    // Attempt to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    // Return success response
    return NextResponse.json(
      { message: 'Email sent successfully!', info },
      { status: 200 }
    );
  } catch (error) {
    // Log detailed error for debugging
    console.error('Error sending email:', error);

    // Capture and return the error response with details
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

// // imimport nodemailer from 'nodemailer';
// import { createClient } from '@supabase/supabase-js';
// import axios from 'axios';

// // Ensure environment variables are loaded (if running locally)
// import dotenv from 'dotenv';
// import { NextResponse } from 'next/server';
// dotenv.config();

// const supabaseUrl = process.env.SUPABASE_URL_LC_CHATBOT;
// const supabaseKey = process.env.SUPABASE_API_KEY;
// const client = createClient(supabaseUrl, supabaseKey);

// export async function POST(req, res) {
//     try {
//         const { content, embeddings } = await req.json(); // Assumes req body is JSON

//         // Store the document and its embeddings in the Supabase `documents` table
//         const { error: insertError } = await client
//             .from('documents')
//             .insert([{ content, embedding: embeddings }]);

//         if (insertError) throw insertError;

//         // Retrieve matching documents
//         const { data: matches, error: matchError } = await client.rpc('match_documents', {
//             query_embedding: embeddings,
//             match_threshold: 0.8,
//             match_count: 5
//         });

//         if (matchError) throw matchError;

//         // Send a JSON response with matched documents
//         return NextResponse.json({ matches });
//     } catch (error) {
//         console.error('Error storing/retrieving embeddings:', error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }


// app/api/issues/create/route.js

// import { createClient } from '@supabase/supabase-js';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { NextResponse } from 'next/server';

// const supabaseClient = createClient(process.env.SUPABASE_URL_LC_CHATBOT, process.env.SUPABASE_API_KEY);
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// const standaloneQuestionTemplate = "Given a question convert it to a standalone question: {question} standalone question: ";
// const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

// async function generateStandaloneQuestion(question) {
//     const promptText = await standaloneQuestionPrompt.format({ question });
//     const result = await model.generateContent(promptText);
//     return result.response.text() || 'No response';
// }

// async function generateEmbedding(text) {
//     try {
//         const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
//         const result = await embeddingModel.embedContent(text);
//         return result.embedding.values;
//     } catch (err) {
//         console.error("Error generating embedding:", err);
//         return null;
//     }
// }
// async function retrieveMatches(embedding) {
//     const { data, error } = await supabaseClient.rpc('match_transactions', {
//         query_embedding: embedding,
//         match_count: 10,
//         match_threshold: 0.8 // or any appropriate threshold value
//     });

//     if (error) {
//         console.error("Error retrieving matches:", error);
//         return "";
//     }
//     return data.map(chunk => chunk.content).join(" ");
// }

// async function generateChatResponse(context, masterStandaloneQuestion) {
//     const masterPrompt = `
//     The following information is provided for educational purposes on public health and wellness. 
//     Context: ${context}
//     Question: ${masterStandaloneQuestion}
//     Please provide a concise, professional response focused on educational guidance for reproductive health.
//     The tone should be informative and respectful, and aim to empower individuals with safe and healthy practices.`;

//     const result = await model.generateContent(masterPrompt);
//     return result.response.text() || 'No response';
// }

// // Next.js API handler for the POST request
// export async function POST(req) {
//     try {
//         console.log("Received POST request to /api/issues/create");

//         const { question, senderId } = await req.json();
//         if (!question || !senderId) {
//             console.log("Missing required fields: question or senderId.");
//             return NextResponse.json({ error: 'Question and senderId are required.' }, { status: 400 });
//         }

//         console.log("Generating standalone question...");
//         const standaloneQuestion = await generateStandaloneQuestion(question);
//         console.log("Standalone question generated:", standaloneQuestion);

//         if (!standaloneQuestion) {
//             console.log("Error: Standalone question generation failed.");
//             return NextResponse.json({ error: 'Failed to generate standalone question.' }, { status: 500 });
//         }

//         console.log("Generating embeddings for standalone question...");
//         const embeddings = await generateEmbedding(standaloneQuestion);
//         console.log("Embeddings generated:", embeddings);

//         console.log("Retrieving context matches from Supabase...");
//         const context = await retrieveMatches(embeddings);
//         console.log("Context retrieved:", context);

//         console.log("Generating chat response with Gemini model...");
//         const answer = await generateChatResponse(context, standaloneQuestion);
//         console.log("Chat response generated:", answer);

//         console.log("Sending response to client.");
//         return NextResponse.json({ senderId, answer }, { status: 200 });

//     } catch (error) {
//         console.error("Error processing issue:", error.message);
//         return NextResponse.json({ error: 'An error occurred while processing the issue.' }, { status: 500 });
//     }
// }



// pages/api/store_embedding.js

// import { createClient } from '@supabase/supabase-js';
// import axios from 'axios';

// const supabaseUrl = process.env.SUPABASE_URL_LC_CHATBOT;
// const supabaseKey = process.env.SUPABASE_API_KEY;
// const client = createClient(supabaseUrl, supabaseKey);

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         const { text, embeddings } = req.body;

//         try {
//             // Store the document and its embeddings in the Supabase `documents` table
//             const { error } = await client
//                 .from('documents')
//                 .insert([{ text, embedding: embeddings }]);

//             if (error) throw error;

//             // Retrieve matching documents
//             const { data: matches, error: matchError } = await client.rpc('match_documents', {
//                 query_embedding: embeddings,
//                 match_threshold: 0.8,
//                 match_count: 5
//             });

//             if (matchError) throw matchError;

//             res.status(200).json({ matches });
//         } catch (error) {
//             console.error('Error storing/retrieving embeddings:', error);
//             res.status(500).json({ error: error.message });
//         }
//     } else {
//         res.status(405).json({ error: 'Only POST method is allowed' });
//     }
// }
