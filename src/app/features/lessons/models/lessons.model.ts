export enum ELessonPages {
  RecordTime = 'record-time',
  LessonTransferringType = 'transferring-type',
  LessonTransferringSuccess = 'transferring-success',
  LessonType = 'lesson-type',
  LessonCanceled = 'canceled',
  LessonSuccess = 'success',
  SelectTeacher = 'select-teacher'
}

export enum ELessonsRecordType {
  Transferring = 'transferring'
}

export enum ELessonsType {
  TeacherGuided = 'teacher-guided',
  SelfStudy = 'self-study',
}

export enum ELessonFlow {
  Booking = 'booking',
  Purchase = 'purchase',
  AddFree = 'free',
  AddCash = 'cash',
}

export interface ISetLesson {
  student_id?: number,
  teacher_id?: number,
  slot_id: number
}

export interface ICancelLesson {
  student_id?: number,
  teacher_id?: number,
  lesson_id: number
  return_slot?: boolean;
}

export interface ITransferringLesson {
  student_id?: number,
  teacher_id?: number,
  lesson_id: number,
  slot_id: number,
}

