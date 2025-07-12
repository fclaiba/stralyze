import { supabase } from '../supabase/client';

export async function getTags() {
  const { data, error } = await supabase.from('tags').select('*');
  if (error) throw error;
  return data;
}

export async function createTag(newTag: any) {
  const { data, error } = await supabase.from('tags').insert([newTag]).single();
  if (error) throw error;
  return data;
}

export async function updateTag(id: string, updates: any) {
  const { data, error } = await supabase.from('tags').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteTag(id: string) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

export async function getCaseTags(caseId: string) {
  const { data, error } = await supabase
    .from('case_tags')
    .select('tag_id, tags(*)')
    .eq('case_id', caseId);
  if (error) throw error;
  return data;
}

export async function addCaseTag(caseId: string, tagId: string) {
  const { error } = await supabase
    .from('case_tags')
    .insert([{ case_id: caseId, tag_id: tagId }]);
  if (error) throw error;
}

export async function removeCaseTag(caseId: string, tagId: string) {
  const { error } = await supabase
    .from('case_tags')
    .delete()
    .eq('case_id', caseId)
    .eq('tag_id', tagId);
  if (error) throw error;
} 