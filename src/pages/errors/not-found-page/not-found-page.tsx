import { CustomLink } from "../../../shared/ui/custom-link/custom-link.tsx";

export const NotFoundPage = () => (
  <div className="w-full flex flex-col p-2">
    <h1>Страница, которую вы ищете, не может быть найдена</h1>

    <p className="fs-sm mt-2.5">
      Возможно, вы перешли по ссылке, в которой была допущена ошибка, или ресурс
      был удален.
      <br /> Попробуйте перейти на{" "}
      <CustomLink to="/"> главную страницу</CustomLink>
    </p>
  </div>
);
