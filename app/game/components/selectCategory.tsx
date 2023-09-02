import Categories from "@/components/categories";
import { Button } from "@/components/styledComponents"
import { Transition } from "@headlessui/react";
import { MouseEventHandler } from "react";

type AppProps = {
  handleCategorySelect: MouseEventHandler<HTMLButtonElement>,
  category: string
}

export default function SelectCategory({ handleCategorySelect, category }: AppProps) {
  return <Transition
    show={!Boolean(category)}
    leave="transition-opacity duration-300"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <h1 className="text-2xl mb-2">Select category</h1>

    <div className="flex gap-2 flex-wrap">
      {Categories.map((category) => {
        return <Button onClick={handleCategorySelect} key={category}>{category}</Button>;
      })}
    </div>
  </Transition>
}
