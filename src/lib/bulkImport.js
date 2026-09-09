// TEMPORARY one-time data-entry helper — not part of the app's normal code path.
// Wired to `window.seedWorkTasks()` in App.jsx so the signed-in user can run it once
// from their own browser console. Remove both after use.
import { addTask } from './tasks'

const TAG = 'work'
const END_DATE = '2026-09-11'
const PRIORITY = 5

const subtasks = (...titles) => titles.map((title) => ({ title }))

const TASKS = [
  { title: 'Brag review and submit' },
  {
    title: 'Food shop',
    subtasks: subtasks(
      'iOS submission',
      'Google login not working in Play Store build',
      'Dynamic OTP length',
      'Punch line update inside app and in Play Store',
    ),
  },
  {
    title: 'Meat House',
    subtasks: subtasks(
      'Share estimation with Amr for Payment',
      'Tiktok, Google, and FB analytics integration and testing',
    ),
  },
  {
    title: 'Shopify app',
    subtasks: subtasks(
      'MVP -> Android and iOS submission (blocker: icon)',
      'Abandoned cart testing and confirmation + FCM api post integration',
    ),
  },
  {
    title: 'Choice Legacy',
    subtasks: subtasks('Update API', 'Cart blank page issue'),
  },
  {
    title: 'Ispahani',
    subtasks: subtasks(
      'Password reset feature implementation (Issue raised by Utsho. Discuss with Amit Da)',
      'Reports update',
      'Dead letter order handling',
      'Auto close day session',
      'Daily crashlytics check',
    ),
  },
  {
    title: 'PetsJo',
    subtasks: subtasks('Planning for the solution and the target of this week'),
  },
  { title: 'Vitalac', subtasks: subtasks('Time entry') },
  { title: 'Awrid', subtasks: subtasks('Get update about the PS and AS accounts') },
  { title: 'Ask Ankan to get me involved in a presale meeting' },
  { title: 'Ask Aria apu about the scope of the offline app' },
  { title: 'Ask Odoo team about the API update' },
]

export async function seedWorkTasks(uid) {
  console.log(`Importing ${TASKS.length} tasks…`)
  for (const t of TASKS) {
    await addTask(uid, {
      title: t.title,
      details: '',
      endDate: END_DATE,
      taskPriority: PRIORITY,
      tags: [TAG],
      subtasks: t.subtasks || [],
    })
    console.log('✓', t.title)
  }
  console.log('Done.')
}
