import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native"





type Props = TouchableOpacityProps & {
  title: string
  colors?: "danger" | "primary"
}



export function Button({ title, colors = "primary", ...rest }: Props) {
  // { bgColor: "bg-blue-500", color: "text-white" } | { bgColor: "bg-red-500", color: "text-white" }

  const choosenColors = colors === "primary" ? { bgColor: "bg-blue-500", color: "text-white" } : { bgColor: "bg-red-500", color: "text-white" }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`h-12 w-full ${choosenColors.bgColor} items-center justify-center rounded-sm`}
      {...rest}
    >
      <Text className={`${choosenColors.color} text-sm font-semiBold uppercase`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
