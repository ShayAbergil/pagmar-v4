import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' })
  }

  const { action } = req.query  // Get action from the URL: /api/overview?action=insertUserRecord
  const body = req.body

  if (!action) {
    return res.status(400).json({ error: 'Missing action' })
  }

  try {
    if (action === 'insertUserRecord') {
      const { user_id, timeSpentSeconds, poll_version } = body
      const { error } = await supabase.from('User_records').insert([
        { user_id, time_in_hp: timeSpentSeconds, poll_version },
      ])
      if (error) throw new Error(error.message)
      return res.status(200).json({ success: true })
    }

    if (action === 'insertAnswers') {
      const { userAnswers } = body
      const { data, error } = await supabase.from('Overview_answers').insert(userAnswers).select()
      if (error) throw new Error(error.message)
      return res.status(200).json({ success: true, data })
    }

    if (action === 'incrementCounts') {
      const { userAnswers } = body
      const errors = []

      await Promise.all(
        userAnswers.map(async (answer) => {
          if (answer.answer_content_t || answer.answer_content_int !== null) {
            const { data, error } = await supabase
              .from('Overview_questions')
              .select('oq_answer_count')
              .eq('id', answer.oq_id)
              .single()

            if (error) {
              errors.push(`Fetch failed for ${answer.oq_id}: ${error.message}`)
              return
            }

            const newCount = (data?.oq_answer_count || 0) + 1
            const { error: updateError } = await supabase
              .from('Overview_questions')
              .update({ oq_answer_count: newCount })
              .eq('id', answer.oq_id)

            if (updateError) {
              errors.push(`Update failed for ${answer.oq_id}: ${updateError.message}`)
            }
          }
        })
      )

      if (errors.length > 0) {
        return res.status(207).json({ partialSuccess: true, errors })
      }

      return res.status(200).json({ success: true })
    }

    return res.status(400).json({ error: 'Unknown action' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
