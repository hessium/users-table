import { Component, type PropsWithChildren } from 'react';

type TErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundaryLayout extends Component<
  PropsWithChildren,
  TErrorBoundaryState
> {
  state: TErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-dvh flex-center">
          <div className="max-w-form flex w-full flex-col gap-2.5">
            <h1 className="">
              Кажется, что-то пошло не так и сломался один из скриптов
            </h1>

            <button onClick={() => window.location.reload()}>
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
