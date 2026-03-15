/* ====== БАЗА ДАНИХ — Firestore ====== */

import { db } from './firebase-config.js';

const COL = 'notes';

/** Realtime підписка на нотатки користувача */
export function subscribeToNotes(userId, callback) {
  return db.collection(COL)
    .where('userId', '==', userId)
    .orderBy('date', 'desc')
    .onSnapshot(
      (snap) => {
        const notes = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() ?? new Date(),
        }));
        callback(notes, null);
      },
      (err) => callback([], err)
    );
}

/** Зберегти або оновити нотатку */
export async function saveNote(note) {
  const { id, ...data } = note;
  const payload = {
    ...data,
    date:     firebase.firestore.FieldValue.serverTimestamp(),
    pinned:   data.pinned   ?? false,
    archived: data.archived ?? false,
    tags:     data.tags     ?? [],
    reminder: data.reminder ?? null,
  };
  if (id) {
    await db.collection(COL).doc(id).update(payload);
    return id;
  }
  const ref = await db.collection(COL).add(payload);
  return ref.id;
}

/** Видалити нотатку */
export async function deleteNote(id) {
  await db.collection(COL).doc(id).delete();
}

/** Перемкнути закріплення */
export async function togglePin(id, pinned) {
  await db.collection(COL).doc(id).update({
    pinned,
    date: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

/** Перемкнути архів */
export async function toggleArchive(id, archived) {
  await db.collection(COL).doc(id).update({
    archived,
    date: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

/** Пакетний імпорт */
export async function importNotes(notes, userId) {
  const CHUNK = 400;
  let count = 0;
  for (let i = 0; i < notes.length; i += CHUNK) {
    const batch = db.batch();
    notes.slice(i, i + CHUNK).forEach(note => {
      const { id, ...data } = note;
      const ref = db.collection(COL).doc();
      batch.set(ref, {
        ...data,
        userId,
        date:     firebase.firestore.Timestamp.fromDate(
                    data.date ? new Date(data.date) : new Date()
                  ),
        pinned:   !!data.pinned,
        archived: !!data.archived,
        tags:     data.tags ?? [],
        color:    data.color ?? '#4dabf7',
      });
      count++;
    });
    await batch.commit();
  }
  return count;
}

/** Зберегти версію нотатки в підколекцію history */
export async function saveNoteHistory(noteId, version) {
  const ref = db.collection('notes').doc(noteId).collection('history');
  // Зберігаємо максимум 20 версій
  const snap = await ref.orderBy('savedAt', 'desc').get();
  if (snap.size >= 20) {
    const oldest = snap.docs[snap.docs.length - 1];
    await oldest.ref.delete();
  }
  await ref.add(version);
}

/** Отримати історію версій нотатки */
export async function getNoteHistory(noteId) {
  const snap = await db.collection('notes').doc(noteId)
    .collection('history')
    .orderBy('savedAt', 'desc')
    .limit(20)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
