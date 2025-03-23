import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CustomBreadcrumbs = ({
	breadcrumbs,
	currentPage,
}: { breadcrumbs: { label: string; href: string }[]; currentPage: string }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((breadcrumb, i) => (
					<>
						{/* biome-ignore lint/suspicious/noArrayIndexKey: <explanation> */}
						<BreadcrumbItem key={breadcrumb.href + i}>
							<BreadcrumbLink href={breadcrumb.href}>
								{breadcrumb.label}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator key={`${breadcrumb.href}separator`} />
					</>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>{currentPage}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default CustomBreadcrumbs;
