// backend/src/controllers/contact.controller.js
const Contact = require('../models/ContactModel'); // make sure this exists
const { sendContactResponse } = require('../utils/mailer'); // from your mailer.js

// Submit a new contact message (public)
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to DB (if Contact model exists)
    let ticket;
    if (Contact) {
      ticket = await Contact.create({
        name,
        email,
        subject,
        message,
        status: 'open',
        createdAt: new Date(),
      });
    }

    // Send acknowledgment email (if mailer is configured)
    try {
      if (sendContactResponse) {
        await sendContactResponse(
          email,
          name,
          subject,
          "Thank you for contacting us. We’ll get back soon.",
          ticket ? ticket._id : Date.now() // fallback ticket number
        );
      }
    } catch (mailError) {
      console.error("❌ Mail send failed:", mailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Contact form submitted 🚀",
      ticket,
    });
  } catch (error) {
    console.error("❌ Contact submit error:", error);
    res.status(500).json({ success: false, error: "Error submitting contact" });
  }
};

// Get tickets for logged-in user
const getUserTickets = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const tickets = Contact
      ? await Contact.find({ email: req.user.email })
      : [];

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching user tickets" });
  }
};

// Get specific ticket details
const getTicketDetails = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticket = Contact
      ? await Contact.findById(ticketNumber)
      : null;

    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching ticket details" });
  }
};

// Admin: Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = Contact ? await Contact.find() : [];
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching all tickets" });
  }
};

// Admin: Respond to a ticket
const respondToTicket = async (req, res) => {
  try {
    const { ticketId, responseMessage } = req.body;

    const ticket = Contact ? await Contact.findById(ticketId) : null;
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });

    ticket.response = responseMessage;
    ticket.status = "responded";
    if (Contact) await ticket.save();

    // Send email response
    try {
      if (sendContactResponse) {
        await sendContactResponse(
          ticket.email,
          ticket.name,
          ticket.subject,
          responseMessage,
          ticket._id
        );
      }
    } catch (mailError) {
      console.error("❌ Mail send failed:", mailError.message);
    }

    res.json({ success: true, message: "Response sent 🚀", ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error responding to ticket" });
  }
};

// Admin: Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = Contact ? await Contact.findById(ticketId) : null;
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });

    ticket.status = status;
    if (Contact) await ticket.save();

    res.json({ success: true, message: "Status updated 🚀", ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating ticket status" });
  }
};

module.exports = {
  submitContact,
  getUserTickets,
  getTicketDetails,
  getAllTickets,
  respondToTicket,
  updateTicketStatus,
};
