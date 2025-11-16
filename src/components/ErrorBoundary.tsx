import React from 'react';

const serializeError = (error: any) => {
  if (error instanceof Error) {
    // Escape any HTML content to prevent XSS and React issues
    const message = error.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const stack = error.stack ? error.stack.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    return message + '\n' + stack;
  }
  try {
    // Safe JSON stringification
    const jsonString = JSON.stringify(error, null, 2);
    return jsonString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  } catch {
    return String(error).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded">
          <h2 className="text-red-500">Something went wrong.</h2>
          <pre className="mt-2 text-sm whitespace-pre-wrap break-words">{serializeError(this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}