import { useEffect, useState } from "react"
import { useGetUsersByNidOrBirthRegQuery } from "@/features/users/userApiSlice"
import Image from "next/image"

// Debounce utility
function useDebounce(value, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const PersonSelector = ({ onSelect, label, initialValue }) => {
  const [inputValue, setInputValue] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [triggerSearch, setTriggerSearch] = useState(false)
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  const debouncedInput = useDebounce(inputValue, 500)

  const { data, isFetching } = useGetUsersByNidOrBirthRegQuery(debouncedInput, {
    skip: !debouncedInput || !triggerSearch,
  })

  const responseData = data?.data

  useEffect(() => {
    if (debouncedInput.trim()) {
      setTriggerSearch(true)
    }
    if (!inputValue) {
        setTriggerSearch(false)
    }
  }, [debouncedInput])

  const handleSelect = () => {
    if (responseData && responseData._id) {
      setSelectedUser(responseData)
      onSelect(responseData._id)
      setTriggerSearch(false)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTriggerSearch(true)
    }
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <input
        type="text"
        value={initialValue || responseData?.name || inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter NID or Birth Registration"
        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
      />

      {/* Dropdown */}
      {triggerSearch && responseData && responseData._id && (
        <div
          className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700 cursor-pointer"
          onClick={handleSelect}
        >
          <div className="flex items-center gap-3 p-2">
            <Image
              src={imageUrl+responseData.profileImage}
              alt="user"
              width={50}
              height={50}
              className="object-cover aspect-square rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-300">
                {responseData.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Blood Group: {responseData.bloodGroup || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonSelector
