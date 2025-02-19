import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <SettingsForm />
    </div>
  )
}

