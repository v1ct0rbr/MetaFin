import { colors } from "@/styles/colors"
import { MaterialIcons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

type Props = {
  title: string
  subtitle: string
  handleOnPress?: () => void,
  hasActionButton?: boolean
}

export function Header({ title, subtitle, hasActionButton = false, handleOnPress = () => { } }: Props) {
  return (
    <View className="mt-14 mb-12">
      <View className="flex-row items-center justify-between">
        <Text className="text-white font-bold text-4xl">{title}</Text>
        {hasActionButton && <TouchableOpacity onPress={handleOnPress}>
          <MaterialIcons name="delete" size={24} color={colors.red[500]} />
        </TouchableOpacity>}


      </View>
      <Text className="text-white font-regular text-lg">{subtitle}</Text>
    </View>
  )
}
