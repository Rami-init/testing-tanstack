import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { fetchUserAddressQueryOptions } from '@/data/user'
import AccountSettingsForm from '@/features/profile/AccountSettingsForm'
import ChangePasswordForm from '@/features/profile/ChangePasswordForm'

export const Route = createFileRoute('/_rootLayout/profile/account')({
  loader: ({ context }) => {
    const UserAddresses = context.queryClient.prefetchQuery(
      fetchUserAddressQueryOptions(),
    )
    return UserAddresses
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: userAddresses } = useSuspenseQuery(
    fetchUserAddressQueryOptions(),
  )
  return (
    <main className="flex flex-col gap-4 container mx-auto flex-1">
      <section className="bg-white rounded-lg border border-gray-200 h-fit flex flex-col ">
        <h1 className="border-b border-gray-200 p-4 text-foreground text-lg font-semibold">
          Account Settings
        </h1>
        {userAddresses && <AccountSettingsForm user={userAddresses} />}
      </section>
      <section className="bg-white rounded-lg border border-gray-200 h-fit flex flex-col ">
        <h1 className="border-b border-gray-200 p-4 text-foreground text-lg font-semibold">
          Change Password
        </h1>
        <ChangePasswordForm />
      </section>
    </main>
  )
}
