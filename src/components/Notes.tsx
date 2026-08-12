/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHabitStore } from '../store';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  FileText, 
  X, 
  Save, 
  StickyNote, 
  Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Notes() {
  const { notes, addNote, editNote, deleteNote, language } = useHabitStore();
  const isEn = language === 'en';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Open modal for a new note
  const handleOpenNewNote = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setIsModalOpen(true);
  };

  // Open modal for editing a note
  const handleOpenEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setTitle(note.title);
      setContent(note.content);
      setIsModalOpen(true);
    }
  };

  // Save / submit note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNoteId) {
      editNote(editingNoteId, title.trim(), content.trim());
    } else {
      addNote(title.trim(), content.trim());
    }
    
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setEditingNoteId(null);
  };

  // Filtered notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full flex flex-col min-h-screen" dir={isEn ? "ltr" : "rtl"}>
      {/* Header Widget */}
      <div className="bg-gradient-to-l from-indigo-500 to-app-brand p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0 mb-6">
        <div className={`flex items-center gap-3.5 ${isEn ? "flex-row text-left" : "flex-row-reverse text-right"}`}>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
            📝
          </div>
          <div>
            <h2 className="font-sans font-black text-lg md:text-xl">
              {isEn ? "Personal Notes Diary" : "دفترچه یادداشت شخصی عادتیار"}
            </h2>
            <p className="text-white/85 text-[11px] leading-relaxed mt-1 font-sans">
              {isEn 
                ? "Write down your thoughts, daily insights, progress reviews, and golden self-discipline reminders." 
                : "اندیشه‌ها، نکات روزانه، ارزیابی رفتار و جملات الهام‌بخش رشد فردی خود را در بستری امن ثبت کنید."}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewNote}
          className={`px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95 ${isEn ? "flex-row" : "flex-row-reverse"}`}
        >
          <Plus size={16} />
          <span>{isEn ? "New Note" : "یادداشت جدید"}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="mb-6 relative">
        <div className={`absolute inset-y-0 ${isEn ? "left-0 pl-3.5" : "right-0 pr-3.5"} flex items-center pointer-events-none text-app-muted`}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder={isEn ? "Search notes..." : "جست‌وجو در یادداشت‌ها..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-app-card border border-app-border hover:border-app-brand/40 focus:border-app-brand rounded-2xl ${isEn ? "pl-11 pr-4" : "pr-11 pl-4"} py-3 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-brand/10 transition-all font-sans`}
        />
      </div>

      {/* Grid of Notes with AnimatePresence */}
      <div className="flex-1">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-app-card border border-app-border rounded-3xl mt-2">
            <div className="w-16 h-16 bg-app-widget border border-app-border/40 text-app-muted rounded-2xl flex items-center justify-center text-3xl mb-4">
              <StickyNote size={30} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-app-text mb-1">
              {searchQuery ? (isEn ? "No results found" : "یادداشتی پیدا نشد") : (isEn ? "Write your first note" : "دفترچه شما خالی است")}
            </h3>
            <p className="text-xs text-app-muted max-w-sm leading-relaxed mb-6 font-sans">
              {searchQuery 
                ? (isEn ? "Try searching for other words or phrases." : "توصیه می‌شود کلمات متفاوتی را جستجو فرمایید.") 
                : (isEn ? "Create folders of goals, daily feelings, or thoughts to organize your life." : "با لمس دکمه بالا، نخستین یادداشت خود را برای رصد تفکرات روزانه‌تان بنویسید.")}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenNewNote}
                className={`py-2 px-4 bg-app-brand hover:opacity-95 text-white rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-sm`}
              >
                <Plus size={14} />
                <span>{isEn ? "Create First Note" : "نوشتن اولین یادداشت"}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  key={note.id}
                  className="bg-app-card border border-app-border hover:border-app-brand/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between group transition-all duration-200 hover:shadow-xs relative overflow-hidden h-[200px]"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500/20 to-app-brand/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className={`flex items-center justify-between gap-3 mb-2.5 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                      <h3 className="font-bold text-sm text-app-text truncate flex-1 leading-snug">
                        {note.title}
                      </h3>
                      <div className={`flex items-center gap-1 shrink-0 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                        <button
                          onClick={() => handleOpenEditNote(note.id)}
                          className="p-1.5 text-app-muted hover:text-indigo-500 hover:bg-app-widget rounded-lg transition-colors cursor-pointer"
                          title={isEn ? "Edit Note" : "ویرایش یادداشت"}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 text-app-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title={isEn ? "Delete Note" : "حذف یادداشت"}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs text-app-muted leading-relaxed font-sans line-clamp-5 whitespace-pre-wrap ${isEn ? "text-left" : "text-right"}`}>
                      {note.content}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3.5 border-t border-app-border/40 flex items-center gap-1.5 text-[10px] text-app-muted font-sans font-medium select-none ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                    <Calendar size={12} className="text-app-brand" />
                    <span>
                      {isEn ? "Created:" : "ثبت‌شده:"} {note.createdAt}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Note Form Dialog / Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-app-card border border-app-border max-w-lg w-full rounded-2xl sm:rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className={`bg-gradient-to-l from-indigo-500 to-app-brand px-5 py-4 flex items-center justify-between text-white ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                  <FileText size={18} />
                  <h3 className="font-sans font-black text-sm">
                    {editingNoteId 
                      ? (isEn ? "Edit Note" : "ویرایش یادداشت") 
                      : (isEn ? "Add New Note" : "ثبت یادداشت جدید")}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">
                    {isEn ? "Note Title" : "عنوان یادداشت"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder={isEn ? "Enter title..." : "یک عنوان برای یادداشت بنویسید..."}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full bg-app-widget border border-app-border focus:border-app-brand focus:bg-app-card rounded-xl px-3.5 py-2.5 text-xs text-app-text focus:outline-none focus:ring-2 focus:ring-app-brand/10 transition-all font-sans ${isEn ? "text-left" : "text-right"}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">
                    {isEn ? "Note Content" : "متن و محتوای یادداشت"}
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder={isEn ? "Write down details, reflections or inspirations..." : "جزئیات، تفکرات یا الهاماتی که مایلید ثبت شوند در اینجا بنویسید..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full bg-app-widget border border-app-border focus:border-app-brand focus:bg-app-card rounded-xl px-3.5 py-2.5 text-xs text-app-text focus:outline-none focus:ring-2 focus:ring-app-brand/10 transition-all font-sans ${isEn ? "text-left" : "text-right"} resize-none`}
                  />
                </div>

                <div className={`flex gap-3 pt-2 ${isEn ? "flex-row justify-end" : "flex-row-reverse justify-start"}`}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-app-widget border border-app-border hover:bg-app-border/40 text-app-text rounded-xl text-xs font-bold font-sans transition-all cursor-pointer"
                  >
                    {isEn ? "Cancel" : "انصراف"}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-app-brand hover:opacity-95 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-500/10 active:scale-95"
                  >
                    <Save size={14} />
                    <span>{isEn ? "Save" : "ذخیره یادداشت"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
