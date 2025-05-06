import { supabase } from '../lib/supabase';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const fetchSubjects = async () => {
  try {
    const { data, error } = await supabase.from('Subjects').select('*').eq('Subject_active', true);
    if (error) throw error;

    const subjectsWithScores = data.map(subject => ({
      ...subject,
      score: subject.subject_rate * subject.s_answer_count * 0.5
    }));

    // Sort subjects by score (ascending)
    subjectsWithScores.sort((a, b) => a.score - b.score);

    // Group by subject_type
    const grouped = {};
    for (const s of subjectsWithScores) {
      if (!grouped[s.subject_type]) grouped[s.subject_type] = [];
      grouped[s.subject_type].push(s);
    }

    // Find first 3 subject_types that have at least 3 subjects
    const selectedTypes = Object.entries(grouped)
      .filter(([_, subjects]) => subjects.length >= 3)
      .slice(0, 3); // get only 3 types

    if (selectedTypes.length < 3) {
      console.warn('Not enough types with 3 subjects each');
      return [];
    }

    // Take 2 subjects per selected type
    const chosenSubjects = selectedTypes
      .map(([_, subjects]) => subjects.slice(0, 2))
      .flat();

    console.log('Chosen Subjects:', chosenSubjects);

    return chosenSubjects;
  } catch (err) {
    console.error('Error fetching subjects:', err);
    return [];
  }
};
