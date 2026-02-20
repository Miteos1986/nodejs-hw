import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();

  res.json({
    message: 'Successfuly find all notes',
    status: 200,
    data: notes,
  });
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.json({
      message: 'Successfuly find all notes',
      status: 200,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);

  res.status(201).json({
    message: 'Note created successfully',
    data: note,
  });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });
  console.log(note);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({
    message: 'Note was successfuly update',
    data: note,
  });
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
