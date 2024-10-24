'use client';

import { formats, modules } from '@/data/constants';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function TextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <ReactQuill modules={modules} formats={formats} theme="snow" value={value} onChange={onChange} />;
}
