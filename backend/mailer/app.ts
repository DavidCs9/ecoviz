import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'noreply@ecoviz.xyz',
    pass: process.env.EMAIL_PASS,
  },
})

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({
          message: 'Method Not Allowed',
        }),
      }
    }

    const { email, results } = JSON.parse(event.body || '{}')

    console.log(email, results)

    if (!email || !results) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Bad Request',
        }),
      }
    }

    if (
      !results.carbonFootprint ||
      !results.housing ||
      !results.transportation ||
      !results.food ||
      !results.consumption
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Bad Request',
        }),
      }
    }

    const mailOptions = {
      from: '"EcoViz" <noreply@ecoviz.xyz>',
      to: email,
      subject: 'Your EcoViz Carbon Footprint Results',
      html: createEmailTemplate(results),
    }

    await transporter.sendMail(mailOptions)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        message: 'Mail sent successfully',
      }),
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    }
  }
}

interface CarbonFootprintResults {
  carbonFootprint: number
  housing: number
  transportation: number
  food: number
  consumption: number
}

const createEmailTemplate = (results: CarbonFootprintResults) => {
  const totalFootprint = results.carbonFootprint.toFixed(2)
  const housingEmissions = results.housing.toFixed(1)
  const transportationEmissions = results.transportation.toFixed(1)
  const foodEmissions = results.food.toFixed(1)
  const consumptionEmissions = results.consumption.toFixed(1)

  const globalAverage = 4000 // kg CO2e
  const usAverage = 16000 // kg CO2e
  const globalComparison = (((results.carbonFootprint - globalAverage) / globalAverage) * 100).toFixed(1)
  const usComparison = (((results.carbonFootprint - usAverage) / usAverage) * 100).toFixed(1)

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your EcoViz Carbon Footprint Results</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #e0f2f1;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      header {
        background: linear-gradient(to right, #4caf50, #2196f3);
        padding: 30px;
        text-align: center;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
      h1 {
        color: #ffffff;
        margin: 0;
      }
      main {
        padding: 30px;
      }
      h2 {
        color: #2e7d32;
        text-align: center;
      }
      .total-footprint {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #4caf50;
        margin: 30px 0;
      }
      .breakdown {
        margin-bottom: 30px;
      }
      .breakdown h3 {
        color: #2e7d32;
      }
      .breakdown ul {
        list-style-type: none;
        padding: 0;
      }
      .breakdown li {
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 8px;
      }
      .breakdown li:nth-child(1) { background-color: #f1f8e9; }
      .breakdown li:nth-child(2) { background-color: #e3f2fd; }
      .breakdown li:nth-child(3) { background-color: #fff3e0; }
      .breakdown li:nth-child(4) { background-color: #f3e5f5; }
      .comparison {
        margin-bottom: 30px;
        padding: 20px;
        background-color: #e8f5e9;
        border-radius: 8px;
      }
      .comparison h3 {
        color: #2e7d32;
        margin-top: 0;
      }
      .next-steps h3 {
        color: #2e7d32;
      }
      .button-container {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        background-color: #4caf50;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 25px;
        margin-top: 20px;
        font-weight: bold;
        transition: background-color 0.3s;
      }
      .button:hover {
        background-color: #45a049;
      }
      footer {
        background-color: #f5f5f5;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #666;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>EcoViz</h1>
      </header>
      <main>
        <h2>Your Carbon Footprint Results</h2>
        <div class="total-footprint">
          ${totalFootprint} kg CO2e / year
        </div>
        <div class="breakdown">
          <h3>Breakdown</h3>
          <ul>
            <li>🏠 Housing: ${housingEmissions} kg CO2e</li>
            <li>🚗 Transportation: ${transportationEmissions} kg CO2e</li>
            <li>🍽️ Food: ${foodEmissions} kg CO2e</li>
            <li>🛍️ Consumption: ${consumptionEmissions} kg CO2e</li>
          </ul>
        </div>
        <div class="comparison">
          <h3>Comparison with Averages</h3>
          <p>Your carbon footprint is ${globalComparison}% ${
            parseFloat(globalComparison) > 0 ? 'higher' : 'lower'
          } than the global average and ${Math.abs(parseFloat(usComparison))}% ${
            parseFloat(usComparison) > 0 ? 'higher' : 'lower'
          } than the US average.</p>
        </div>
        <div class="next-steps">
          <h3>Next Steps</h3>
          <p>Visit our website to view detailed AI recommendations on how to reduce your carbon footprint.</p>
          <div class="button-container">
            <a href="https://ecoviz.xyz/results" class="button">View Full Results</a>
          </div>
        </div>
      </main>
      <footer>
        <p>This email was sent by EcoViz. Please do not reply to this message.</p>
      </footer>
    </div>
  </body>
  </html>`
}
