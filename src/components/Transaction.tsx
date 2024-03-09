import { Pressable, PressableProps, Text, TouchableOpacity, View } from "react-native"

import { colors } from "@/styles/colors"
import { currencyFormat } from "@/utils/currencyFormat"
import { useDateFormat } from '@/utils/dateUtils'
import { MaterialIcons } from "@expo/vector-icons"


import { TransactionResponse } from "@/database/useTransitionRepository"

export type TransactionProps = {
  id: number
  createcreated_at: string
  goal_id: number
  amount: number
}

type Props = PressableProps & {
  transaction: TransactionResponse,
  showDeleteButton?: boolean
  handleDeleteTransaction?: (id: string) => void
}



export function Transaction({ transaction, handleDeleteTransaction, showDeleteButton = false, ...rest }: Props) {

  const dateFormat = useDateFormat();


  return (
    <Pressable
      className="w-full h-16 bg-gray-500 rounded-sm border border-gray-900 p-4 flex-row items-center justify-between"
      {...rest}
    >
      <View>
        <Text
          className="font-regular text-sm"
          style={{
            color: transaction.amount < 0 ? colors.red[500] : colors.green[500],
          }}
        >
          {transaction.amount < 0 ? "- " : "+ "}
          {currencyFormat(transaction.amount).replace("-", "")}
        </Text>

        <Text className="text-gray-300 font-regular text-sm">
          {dateFormat.formatDateTimeToMinutesAgo(transaction.created_at)}
        </Text>
      </View>
      <View className="flex-row items-center h-16 gap-4">

        {showDeleteButton && (
          <TouchableOpacity onPress={() => handleDeleteTransaction(transaction.id)} >
            <MaterialIcons name="delete" color={colors.red[500]} size={24} />
          </TouchableOpacity>)}

      </View>
    </Pressable>
  )
}
